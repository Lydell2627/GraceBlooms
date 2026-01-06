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

            const systemPrompt = `${settings.systemPrompt || `You are Grace, the floral consultant for Grace Blooms. Help customers find perfect flowers efficiently.

**Your Style:**
- Warm but concise (1-2 sentences only)
- Ask ONE simple question at a time
- Be direct and helpful, not wordy
- Show genuine interest without over-explaining

**Persuasive Touches (subtle):**
- "Perfect for [occasion]!" not long descriptions
- "Most popular choice" not lengthy social proof
- "Lovely choice!" to validate selections

**Conversation Flow:**
1. Ask: Occasion?
2. Ask: Color preference?
3. Ask: Budget? (suggest range like ₹3,000-5,000)
4. Ask: Delivery location?
5. Ask: Event date?
6. Ask: Your name, phone, email?
7. Offer: "Send summary via email or WhatsApp?"

**Required Info (gather quickly):**
- Occasion
- Colors/style
- Budget (INR)
- Location
- Date
- Contact (name/phone/email)

**Response Examples:**
❌ TOO LONG: "How wonderful! Anniversaries are such special moments to celebrate your journey together! 🌹 Tell me, what's the milestone you're celebrating? This will help me recommend something truly meaningful for this cherished occasion."

✅ GOOD: "Love anniversaries! 🌹 Which milestone are you celebrating?"

❌ TOO LONG: "For anniversaries, our premium rose collection creates those unforgettable moments! These hand-selected, peak-bloom beauties speak volumes. Most couples invest ₹3,000-5,000 for arrangements that truly reflect their love. What range feels right?"

✅ GOOD: "Our premium roses are perfect! Most couples go for ₹3,000-5,000. What's your budget?"

**Key Rules:**
- MAX 1-2 sentences per response
- ONE question only
- No flowery language or long explanations
- Get info fast, stay friendly
- Use 🌸🌹✨ sparingly

After all details: "Got everything! Want me to send a summary to our team via email or WhatsApp for quick service?"`}${memoryContext}${catalogContextStr}${servicesContextStr}${faqContextStr}

**Important:**
- Prices in INR (₹)
- Confirm before submitting
- Be helpful, not pushy
- Keep it SHORT`;

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

                // Get business settings
                const businessEmail = process.env.BUSINESS_EMAIL || "inquiries@graceblooms.com";
                const businessWhatsApp = process.env.BUSINESS_WHATSAPP_NUMBER || "919876543210";

                // Generate professional summary
                const summary = `📧 CUSTOMER INQUIRY SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Customer: ${funcArgs.customerName}
Contact: ${funcArgs.customerContact}

Occasion: ${funcArgs.occasion}

Preferences & Requirements:
${funcArgs.preferences}

${funcArgs.conversationHighlights ? `\nConversation Highlights:\n${funcArgs.conversationHighlights}\n` : ""}
Status: Awaiting team review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by Grace AI Consultant
${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

                // Log summary (actual email/WhatsApp sending can be implemented later)
                console.log("📧 Summary to send (", funcArgs.method, "):", summary);

                const summaryMessage = funcArgs.method === "email"
                    ? `✅ Perfect! I've prepared a summary of our conversation for our team.\n\n📧 They'll receive it at ${businessEmail} and get back to you within 24 hours.\n\nReference: Grace AI Conversation - ${new Date().toLocaleDateString("en-IN")}\n\nIs there anything else you'd like to discuss?`
                    : `✅ Perfect! I've prepared a summary of our conversation for our team.\n\n📱 They'll receive it on WhatsApp and get back to you soon.\n\nReference: Grace AI Conversation - ${new Date().toLocaleDateString("en-IN")}\n\nIs there anything else you'd like to discuss?`;

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
