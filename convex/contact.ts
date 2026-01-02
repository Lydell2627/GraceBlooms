import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a contact inquiry
export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
        source: v.string(),
        catalogItemId: v.optional(v.id("catalogItems")),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("contactInquiries", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            message: args.message,
            source: args.source,
            catalogItemId: args.catalogItemId,
            status: "new",
            createdAt: Date.now(),
        });
        return id;
    },
});

// Admin: List contact inquiries
export const list = query({
    args: { status: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let items = await ctx.db
            .query("contactInquiries")
            .order("desc")
            .collect();

        if (args.status) {
            items = items.filter((item) => item.status === args.status);
        }

        return items;
    },
});

// Admin: Update inquiry status
export const updateStatus = mutation({
    args: {
        id: v.id("contactInquiries"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
        return args.id;
    },
});

// Admin: Get inquiry with catalog item details
export const getWithItem = query({
    args: { id: v.id("contactInquiries") },
    handler: async (ctx, args) => {
        const inquiry = await ctx.db.get(args.id);
        if (!inquiry) return null;

        let catalogItem = null;
        if (inquiry.catalogItemId) {
            catalogItem = await ctx.db.get(inquiry.catalogItemId);
        }

        return { ...inquiry, catalogItem };
    },
});
