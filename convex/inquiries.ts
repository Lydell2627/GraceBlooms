import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Generate a unique reference ID
function generateReferenceId(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INQ-${dateStr}-${randomStr}`;
}

// Create inquiry (called by Gemini function calling)
export const createInquiry = mutation({
    args: {
        userId: v.string(),
        selectedCatalogItemIds: v.optional(v.array(v.id("catalogItems"))),
        occasion: v.optional(v.string()),
        preferredColors: v.optional(v.string()),
        budgetMin: v.optional(v.number()),
        budgetMax: v.optional(v.number()),
        deliveryArea: v.optional(v.string()),
        eventDateTime: v.optional(v.string()),
        messageNote: v.optional(v.string()),
        contactName: v.string(),
        contactPhone: v.string(),
        contactEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const referenceId = generateReferenceId();
        const now = Date.now();

        const inquiryId = await ctx.db.insert("inquiries", {
            userId: args.userId,
            referenceId,
            selectedCatalogItemIds: args.selectedCatalogItemIds,
            occasion: args.occasion,
            preferredColors: args.preferredColors,
            budgetMin: args.budgetMin,
            budgetMax: args.budgetMax,
            deliveryArea: args.deliveryArea,
            eventDateTime: args.eventDateTime,
            messageNote: args.messageNote,
            contactName: args.contactName,
            contactPhone: args.contactPhone,
            contactEmail: args.contactEmail,
            whatsappSent: false,
            emailSent: false,
            status: "NEW",
            createdAt: now,
            updatedAt: now,
        });

        return { inquiryId, referenceId };
    },
});

// Update inquiry status
export const updateInquiryStatus = mutation({
    args: {
        inquiryId: v.id("inquiries"),
        status: v.string(),
        whatsappSent: v.optional(v.boolean()),
        emailSent: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Build patch object, only including defined values
        const patch: { status: string; updatedAt: number; whatsappSent?: boolean; emailSent?: boolean } = {
            status: args.status,
            updatedAt: Date.now(),
        };

        if (args.whatsappSent !== undefined) {
            patch.whatsappSent = args.whatsappSent;
        }
        if (args.emailSent !== undefined) {
            patch.emailSent = args.emailSent;
        }

        await ctx.db.patch(args.inquiryId, patch);
    },
});

// Get user's inquiries
export const getUserInquiries = query({
    args: { userId: v.string(), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const inquiries = await ctx.db
            .query("inquiries")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .take(args.limit ?? 10);

        return inquiries;
    },
});

// Get inquiry by reference ID
export const getByReferenceId = query({
    args: { referenceId: v.string() },
    handler: async (ctx, args) => {
        const inquiry = await ctx.db
            .query("inquiries")
            .withIndex("by_referenceId", (q) => q.eq("referenceId", args.referenceId))
            .first();

        return inquiry;
    },
});

// Send WhatsApp inquiry (action - calls external API)
export const sendWhatsAppInquiry = action({
    args: {
        inquiryId: v.id("inquiries"),
        inquiryData: v.object({
            referenceId: v.string(),
            contactName: v.string(),
            contactPhone: v.string(),
            contactEmail: v.string(),
            occasion: v.optional(v.string()),
            preferredColors: v.optional(v.string()),
            budgetMin: v.optional(v.number()),
            budgetMax: v.optional(v.number()),
            deliveryArea: v.optional(v.string()),
            eventDateTime: v.optional(v.string()),
            messageNote: v.optional(v.string()),
            catalogItems: v.optional(v.array(v.string())),
        }),
    },
    handler: async (ctx, args) => {
        const whatsappApiUrl = process.env.WHATSAPP_API_URL;
        const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
        const businessWhatsAppNumber = process.env.BUSINESS_WHATSAPP_NUMBER;

        if (!whatsappApiUrl || !whatsappApiToken || !businessWhatsAppNumber) {
            console.error("WhatsApp API credentials not configured");
            await ctx.runMutation(api.inquiries.updateInquiryStatus, {
                inquiryId: args.inquiryId,
                status: "FAILED",
            });
            return { success: false, error: "WhatsApp not configured" };
        }

        // Format inquiry message
        const catalogItemsText = args.inquiryData.catalogItems?.length
            ? `\n🌸 Items: ${args.inquiryData.catalogItems.join(", ")}`
            : "";

        const budgetText = args.inquiryData.budgetMin && args.inquiryData.budgetMax
            ? `\n💰 Budget: ₹${args.inquiryData.budgetMin} - ₹${args.inquiryData.budgetMax}`
            : "";

        const message = `🌺 *New Inquiry from Grace Blooms Bot*

📋 Reference: ${args.inquiryData.referenceId}

👤 Customer Details:
• Name: ${args.inquiryData.contactName}
• Phone: ${args.inquiryData.contactPhone}
• Email: ${args.inquiryData.contactEmail}

🎉 Occasion: ${args.inquiryData.occasion || "Not specified"}${catalogItemsText}
🎨 Preferred Colors: ${args.inquiryData.preferredColors || "Not specified"}${budgetText}
📍 Delivery Area: ${args.inquiryData.deliveryArea || "Not specified"}
📅 Event Date/Time: ${args.inquiryData.eventDateTime || "Not specified"}

💬 Message: ${args.inquiryData.messageNote || "No additional message"}

---
Sent via Grace Blooms AI Bot`;

        try {
            // Example: WhatsApp Business API call (adjust based on your provider)
            const response = await fetch(whatsappApiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${whatsappApiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: businessWhatsAppNumber,
                    type: "text",
                    text: { body: message },
                }),
            });

            if (!response.ok) {
                throw new Error(`WhatsApp API error: ${response.status}`);
            }

            await ctx.runMutation(api.inquiries.updateInquiryStatus, {
                inquiryId: args.inquiryId,
                whatsappSent: true,
                status: "SENT",
            });

            return { success: true };
        } catch (error) {
            console.error("WhatsApp send failed:", error);
            await ctx.runMutation(api.inquiries.updateInquiryStatus, {
                inquiryId: args.inquiryId,
                status: "FAILED",
            });
            return { success: false, error: String(error) };
        }
    },
});

// Send Email inquiry (action - calls Resend)
export const sendEmailInquiry = action({
    args: {
        inquiryId: v.id("inquiries"),
        inquiryData: v.object({
            referenceId: v.string(),
            contactName: v.string(),
            contactPhone: v.string(),
            contactEmail: v.string(),
            occasion: v.optional(v.string()),
            preferredColors: v.optional(v.string()),
            budgetMin: v.optional(v.number()),
            budgetMax: v.optional(v.number()),
            deliveryArea: v.optional(v.string()),
            eventDateTime: v.optional(v.string()),
            messageNote: v.optional(v.string()),
            catalogItems: v.optional(v.array(v.string())),
        }),
    },
    handler: async (ctx, args) => {
        const resendApiKey = process.env.RESEND_API_KEY;

        // Get email from settings
        const siteSettings = await ctx.runQuery(api.settings.get, {});
        const businessEmail = siteSettings?.email || process.env.BUSINESS_EMAIL || "inquiries@graceblooms.com";

        if (!resendApiKey) {
            console.error("Resend API key not configured");
            return { success: false, error: "Email not configured" };
        }

        const catalogItemsHtml = args.inquiryData.catalogItems?.length
            ? `<p><strong>🌸 Items:</strong> ${args.inquiryData.catalogItems.join(", ")}</p>`
            : "";

        const budgetHtml = args.inquiryData.budgetMin && args.inquiryData.budgetMax
            ? `<p><strong>💰 Budget:</strong> ₹${args.inquiryData.budgetMin} - ₹${args.inquiryData.budgetMax}</p>`
            : "";

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌺 New Inquiry from Grace Blooms Bot</h1>
            <p style="margin: 0;">Reference: ${args.inquiryData.referenceId}</p>
        </div>
        <div class="content">
            <h2>👤 Customer Details</h2>
            <div class="field"><strong>Name:</strong> ${args.inquiryData.contactName}</div>
            <div class="field"><strong>Phone:</strong> ${args.inquiryData.contactPhone}</div>
            <div class="field"><strong>Email:</strong> ${args.inquiryData.contactEmail}</div>

            <h2>📋 Inquiry Details</h2>
            <div class="field"><strong>🎉 Occasion:</strong> ${args.inquiryData.occasion || "Not specified"}</div>
            ${catalogItemsHtml}
            <div class="field"><strong>🎨 Preferred Colors:</strong> ${args.inquiryData.preferredColors || "Not specified"}</div>
            ${budgetHtml}
            <div class="field"><strong>📍 Delivery Area:</strong> ${args.inquiryData.deliveryArea || "Not specified"}</div>
            <div class="field"><strong>📅 Event Date/Time:</strong> ${args.inquiryData.eventDateTime || "Not specified"}</div>

            <h3>💬 Message</h3>
            <p>${args.inquiryData.messageNote || "No additional message"}</p>

            <div class="footer">
                Sent via Grace Blooms AI Bot
            </div>
        </div>
    </div>
</body>
</html>
`;

        try {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Grace Blooms Bot <bot@graceblooms.com>",
                    to: [businessEmail],
                    reply_to: args.inquiryData.contactEmail,
                    subject: `New Inquiry: ${args.inquiryData.referenceId} - ${args.inquiryData.contactName}`,
                    html: emailHtml,
                }),
            });

            if (!response.ok) {
                throw new Error(`Resend API error: ${response.status}`);
            }

            await ctx.runMutation(api.inquiries.updateInquiryStatus, {
                inquiryId: args.inquiryId,
                emailSent: true,
                status: "SENT",
            });

            return { success: true };
        } catch (error) {
            console.error("Email send failed:", error);
            return { success: false, error: String(error) };
        }
    },
});

// Admin: Get all inquiries
export const listAll = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const inquiries = await ctx.db
            .query("inquiries")
            .order("desc")
            .take(args.limit ?? 50);

        return inquiries;
    },
});
