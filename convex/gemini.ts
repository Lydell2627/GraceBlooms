import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize Gemini
function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing in environment variables");
        throw new Error("GEMINI_API_KEY not configured");
    }
    console.log("Gemini client initialized with key length:", apiKey.length);
    return new GoogleGenerativeAI(apiKey);
}

// Define function declarations for Gemini (using SchemaType enum)
const functions = [
    {
        name: "createInquiryRecord",
        description: "Creates an inquiry record when the user confirms they want to submit their inquiry. Only call this after collecting all required information and getting user confirmation.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                occasion: {
                    type: SchemaType.STRING,
                    description: "The occasion for the flowers (e.g., wedding, birthday, anniversary, sympathy)",
                },
                preferredColors: {
                    type: SchemaType.STRING,
                    description: "Preferred color scheme for the arrangement",
                },
                budgetMin: {
                    type: SchemaType.NUMBER,
                    description: "Minimum budget in INR",
                },
                budgetMax: {
                    type: SchemaType.NUMBER,
                    description: "Maximum budget in INR",
                },
                deliveryArea: {
                    type: SchemaType.STRING,
                    description: "Delivery location (Google Maps link or full address provided by user)",
                },
                eventDateTime: {
                    type: SchemaType.STRING,
                    description: "Date and time of the event",
                },
                messageNote: {
                    type: SchemaType.STRING,
                    description: "Additional message or special requests",
                },
                contactName: {
                    type: SchemaType.STRING,
                    description: "Customer's full name",
                },
                contactPhone: {
                    type: SchemaType.STRING,
                    description: "Customer's phone number",
                },
                contactEmail: {
                    type: SchemaType.STRING,
                    description: "Customer's email address",
                },
                selectedCatalogItemIds: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.STRING,
                    },
                    description: "Array of selected catalog item IDs",
                },
            },
            required: ["contactName", "contactPhone", "contactEmail"],
        },
    },
    {
        name: "sendSummary",
        description: "Sends a professional conversation summary to the business via email or WhatsApp. Call this when user requests to send summary after collecting their details.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                method: {
                    type: SchemaType.STRING,
                    description: "Delivery method: 'email' or 'whatsapp'",
                },
                customerName: {
                    type: SchemaType.STRING,
                    description: "Customer's full name",
                },
                customerContact: {
                    type: SchemaType.STRING,
                    description: "Customer's phone or email",
                },
                occasion: {
                    type: SchemaType.STRING,
                    description: "The occasion/event",
                },
                preferences: {
                    type: SchemaType.STRING,
                    description: "Summary of customer's preferences (colors, style, budget, etc.)",
                },
                conversationHighlights: {
                    type: SchemaType.STRING,
                    description: "Key discussion points from the conversation",
                },
            },
            required: ["method", "customerName", "customerContact", "occasion", "preferences"],
        },
    },
];
// Response type for chat action
interface ChatResponse {
    message: string;
    inquiryCreated: boolean;
    referenceId?: string;
    whatsappSent?: boolean;
    emailSent?: boolean;
    whatsappUrl?: string; // URL to open user's WhatsApp
    emailUrl?: string; // mailto: URL to open user's email client
}

// Chat with Gemini (with RAG and function calling)
export const chat = action({
    args: {
        userId: v.string(),
        userMessage: v.string(),
        catalogContext: v.optional(v.array(v.string())), // Catalog items context
        serviceContext: v.optional(v.array(v.string())), // Services context
        faqContext: v.optional(v.array(v.string())), // FAQs context
    },
    handler: async (ctx, args): Promise<ChatResponse> => {
        try {
            const genAI = getGeminiClient();

            // Get AI settings
            const settings = await ctx.runQuery(api.ai.getSettings, {});

            // Get user memory for personalization
            const userMemory = await ctx.runQuery(api.ai.getUserMemory, {
                userId: args.userId,
                limit: 5,
            });

            // Get chat history
            const chatHistory = await ctx.runQuery(api.ai.getChatHistory, {
                userId: args.userId,
                limit: 10,
            });

            // Build system prompt with RAG context
            const memoryContext = userMemory.length > 0
                ? `\n\n**User's Past Preferences:**\n${userMemory.map((m: { content: string }) => `- ${m.content}`).join('\n')}`
                : "";

            const catalogContextStr = args.catalogContext?.length
                ? `\n\n**Available Catalog Items:**\n${args.catalogContext.join('\n')}`
                : "";

            const servicesContextStr = args.serviceContext?.length
                ? `\n\n**Our Services:**\n${args.serviceContext.join('\n')}`
                : "";

            const faqContextStr = args.faqContext?.length
                ? `\n\n**Common Questions & Answers:**\n${args.faqContext.join('\n')}`
                : "";

            const systemPrompt = `${settings.systemPrompt || `You are Grace, floral consultant for Grace Blooms. Help customers efficiently with **warm, concise responses (1-2 sentences, ONE question at a time)**.

**Empathy for Sensitive Occasions:**
If user mentions: death, died, funeral, sympathy, passed, loss, memorial, deceased, condolences
- **Respond with condolence FIRST**
- **Skip asking "what occasion?"** - you already know it's sympathy
- Use: "arrangements/tribute" not "flowers", "honor their memory" not generic phrases
- Example: "I'm so sorry for your loss. Let me help you create a beautiful tribute. What colors would best honor their memory?"

**Conversation Flow:**
1. Occasion? (skip if sympathy mentioned)
2. Color preference?
3. Budget? (suggest ₹3,000-5,000)
4. Delivery location?
5. Event date?
6. **Ask for contact info SEPARATELY** (one at a time):
   - "What's your name?"
   - "What's your phone number?"
   - "What's your email?"
7. **VALIDATE each field immediately:**
   - Name: Real name (min 2 characters, not "test"/"xyz")
     **If invalid:** "I need your real name to proceed."
   - Phone: Must be 10+ digits
     **If invalid:** "Please provide a valid phone (e.g., 9876543210 or +919876543210)"
   - Email: Must have @ and domain
     **If invalid:** "Please provide a valid email (e.g., name@example.com)"
8. **CONFIRM all details**, ask: "Should I send this via email or WhatsApp?"

**Style:**
- **Direct, helpful, not wordy**
- Use 🌸🌹✨ sparingly
- Validate selections: "Lovely choice!", "Perfect for [occasion]!"
- **MAX 1-2 sentences per response**

After validation and confirmation: **"Got everything! Sending this to our team now."**`}${memoryContext}${catalogContextStr}${servicesContextStr}${faqContextStr}

**Prices in INR (₹). VALIDATE, CONFIRM, be empathetic.**`;

            // Initialize model with function calling
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: systemPrompt,
                tools: [{ functionDeclarations: functions as any }],
            });

            // Build chat history for Gemini
            const history = chatHistory.map((msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" as const : "model" as const,
                parts: [{ text: msg.content }],
            }));

            const chat = model.startChat({ history });

            // Send user message
            const result = await chat.sendMessage(args.userMessage);
            const response = result.response;

            // Check for function calls
            const functionCall = response.functionCalls()?.[0];

            // Handle sendSummary function
            if (functionCall && functionCall.name === "sendSummary") {
                const funcArgs = functionCall.args as {
                    method: string;
                    customerName: string;
                    customerContact: string;
                    occasion: string;
                    preferences: string;
                    conversationHighlights?: string;
                };

                // Get business settings for email
                const siteSettings = await ctx.runQuery(api.settings.get, {});
                const businessEmail = siteSettings?.email || process.env.BUSINESS_EMAIL || "inquiries@graceblooms.com";
                const businessWhatsApp = siteSettings?.whatsappNumber || process.env.BUSINESS_WHATSAPP_NUMBER || "919876543210";

                // Generate professional summary for WhatsApp (with markdown)
                const whatsappSummary = `🌸 *Grace Blooms Inquiry*\n\n*Customer:* ${funcArgs.customerName}\n*Contact:* ${funcArgs.customerContact}\n\n*Occasion:* ${funcArgs.occasion}\n\n*Preferences:*\n${funcArgs.preferences}${funcArgs.conversationHighlights ? `\n\n*Notes:*\n${funcArgs.conversationHighlights}` : ""}\n\n---\nVia Grace AI • ${new Date().toLocaleDateString("en-IN")}`;

                // Generate plain text summary for Email
                const emailSummary = `Grace Blooms Inquiry\n\nCustomer: ${funcArgs.customerName}\nContact: ${funcArgs.customerContact}\n\nOccasion: ${funcArgs.occasion}\n\nPreferences:\n${funcArgs.preferences}${funcArgs.conversationHighlights ? `\n\nNotes:\n${funcArgs.conversationHighlights}` : ""}\n\n---\nVia Grace AI • ${new Date().toLocaleDateString("en-IN")}`;

                // Log summary
                console.log("📧 Summary to send (", funcArgs.method, "):", funcArgs.method === "whatsapp" ? whatsappSummary : emailSummary);

                // Generate URLs based on method
                let whatsappUrl: string | undefined;
                let emailUrl: string | undefined;

                if (funcArgs.method === "whatsapp") {
                    const encodedMessage = encodeURIComponent(whatsappSummary);
                    whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodedMessage}`;
                } else {
                    const subject = encodeURIComponent(`Flower Inquiry - ${funcArgs.occasion}`);
                    const body = encodeURIComponent(emailSummary);
                    emailUrl = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
                }

                const summaryMessage = funcArgs.method === "email"
                    ? `✅ Perfect! Click the button below to send your inquiry via email! 📧\n\nYour email client will open with everything pre-filled - just review and hit send!\n\nReference: ${new Date().toLocaleDateString("en-IN")}\n\nAnything else I can help with?`
                    : `✅ Perfect! Click the button below to send your inquiry via WhatsApp! 📱\n\nReference: ${new Date().toLocaleDateString("en-IN")}\n\nAnything else I can help with?`;

                // Store messages
                await ctx.runMutation(api.ai.storeMessage, {
                    userId: args.userId,
                    role: "user",
                    content: args.userMessage,
                });

                await ctx.runMutation(api.ai.storeMessage, {
                    userId: args.userId,
                    role: "assistant",
                    content: summaryMessage,
                });

                return {
                    message: summaryMessage,
                    inquiryCreated: false,
                    whatsappSent: funcArgs.method === "whatsapp",
                    emailSent: funcArgs.method === "email",
                    whatsappUrl,
                    emailUrl,
                };
            }

            if (functionCall && functionCall.name === "createInquiryRecord") {
                // Extract function arguments
                const funcArgs = functionCall.args as {
                    occasion?: string;
                    preferredColors?: string;
                    budgetMin?: number;
                    budgetMax?: number;
                    deliveryArea?: string;
                    eventDateTime?: string;
                    messageNote?: string;
                    contactName: string;
                    contactPhone: string;
                    contactEmail: string;
                    selectedCatalogItemIds?: string[];
                };

                // Create inquiry
                const inquiryResult: { inquiryId: any; referenceId: string } = await ctx.runMutation(api.inquiries.createInquiry, {
                    userId: args.userId,
                    occasion: funcArgs.occasion,
                    preferredColors: funcArgs.preferredColors,
                    budgetMin: funcArgs.budgetMin,
                    budgetMax: funcArgs.budgetMax,
                    deliveryArea: funcArgs.deliveryArea,
                    eventDateTime: funcArgs.eventDateTime,
                    messageNote: funcArgs.messageNote,
                    contactName: funcArgs.contactName,
                    contactPhone: funcArgs.contactPhone,
                    contactEmail: funcArgs.contactEmail,
                    selectedCatalogItemIds: funcArgs.selectedCatalogItemIds as any,
                });

                // Store AI response (WhatsApp/Email deferred for later)
                const confirmationMessage = `✅ Perfect! Your inquiry has been submitted successfully.\n\n📋 Reference ID: **${inquiryResult.referenceId}**\n\nOur team will contact you at ${funcArgs.contactPhone} or ${funcArgs.contactEmail} within 24 hours to discuss your floral needs.\n\nIs there anything else I can help you with today?`;

                await ctx.runMutation(api.ai.storeMessage, {
                    userId: args.userId,
                    role: "user",
                    content: args.userMessage,
                });

                await ctx.runMutation(api.ai.storeMessage, {
                    userId: args.userId,
                    role: "assistant",
                    content: confirmationMessage,
                });

                return {
                    message: confirmationMessage,
                    inquiryCreated: true,
                    referenceId: inquiryResult.referenceId,
                    whatsappSent: false, // Deferred
                    emailSent: false, // Deferred
                };
            }

            // Normal response (no function call)
            const assistantMessage = response.text();

            // Store messages
            await ctx.runMutation(api.ai.storeMessage, {
                userId: args.userId,
                role: "user",
                content: args.userMessage,
            });

            await ctx.runMutation(api.ai.storeMessage, {
                userId: args.userId,
                role: "assistant",
                content: assistantMessage,
            });

            // Store user preferences in memory (simple extraction)
            if (args.userMessage.toLowerCase().includes("prefer") || args.userMessage.toLowerCase().includes("like")) {
                await ctx.runMutation(api.ai.storeMemory, {
                    userId: args.userId,
                    content: `User mentioned: ${args.userMessage.slice(0, 200)}`,
                    category: "preference",
                });
            }

            return {
                message: assistantMessage,
                inquiryCreated: false,
            };
        } catch (error) {
            console.error("Gemini chat error:", error);
            throw new Error(`AI chat failed: ${error}`);
        }
    },
});

export const getRagContext = action({
    args: { userId: v.string() },
    handler: async (ctx): Promise<{ catalogContext: string[]; serviceContext: string[]; faqContext: string[] }> => {
        // Get catalog items
        const catalogItems = await ctx.runQuery(api.catalog.list, {});

        const catalogContext: string[] = catalogItems?.map((item: { title: string; priceMin: number; priceMax: number; shortDescription: string; category: string }) =>
            `${item.title} - ₹${item.priceMin}-₹${item.priceMax} - ${item.shortDescription} (Category: ${item.category})`
        ) || [];

        // Get services
        const services = await ctx.runQuery(api.services.list, {});
        const serviceContext: string[] = services?.map((svc: { title: string; description: string }) =>
            `${svc.title}: ${svc.description}`
        ) || [];

        // Get FAQs
        const faqs = await ctx.runQuery(api.faq.list, {});
        const faqContext: string[] = faqs?.map((faq: { question: string; answer: string }) =>
            `Q: ${faq.question}\nA: ${faq.answer}`
        ) || [];

        return {
            catalogContext,
            serviceContext,
            faqContext,
        };
    },
});
