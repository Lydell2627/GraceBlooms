import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get site settings
export const get = query({
    args: {},
    handler: async (ctx) => {
        const settings = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", "site"))
            .first();
        return settings;
    },
});

// Admin: Update site settings
export const update = mutation({
    args: {
        whatsappNumber: v.optional(v.string()),
        whatsappMessage: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        email: v.optional(v.string()),
        heroHeadline: v.optional(v.string()),
        heroSubheadline: v.optional(v.string()),
        baseCurrency: v.optional(v.string()),
        trustBadges: v.optional(v.array(v.object({
            icon: v.string(),
            title: v.string(),
            description: v.string(),
        }))),
        socialLinks: v.optional(v.object({
            instagram: v.optional(v.string()),
            facebook: v.optional(v.string()),
            twitter: v.optional(v.string()),
            pinterest: v.optional(v.string()),
        })),
        businessHours: v.optional(v.string()),
        location: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", "site"))
            .first();

        const updates = { ...args, updatedAt: Date.now() };

        if (existing) {
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        } else {
            const id = await ctx.db.insert("settings", {
                key: "site",
                ...args,
                updatedAt: Date.now(),
            });
            return id;
        }
    },
});

// Initialize default settings if not exists
export const initialize = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", "site"))
            .first();

        if (!existing) {
            await ctx.db.insert("settings", {
                key: "site",
                heroHeadline: "Emotions in Full Bloom",
                heroSubheadline: "Hand-crafted arrangements that speak the language of the heart. Contact us to order.",
                baseCurrency: "INR",
                trustBadges: [
                    { icon: "Sparkles", title: "Freshness Guaranteed", description: "Sourced directly from local growers" },
                    { icon: "Truck", title: "Same Day Delivery", description: "Order by 2PM for immediate delivery" },
                    { icon: "Shield", title: "Artist Arrangements", description: "Hand-crafted by award-winning designers" },
                ],
                businessHours: "Mon-Sat: 9AM - 8PM, Sun: 10AM - 6PM",
                updatedAt: Date.now(),
            });
        }
    },
});
