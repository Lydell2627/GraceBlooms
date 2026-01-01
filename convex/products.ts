import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all products, optionally filtered by occasion
export const list = query({
    args: {
        occasion: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.occasion) {
            return await ctx.db
                .query("products")
                .withIndex("by_occasion", (q) => q.eq("occasion", args.occasion!))
                .collect();
        }
        return await ctx.db.query("products").collect();
    },
});

// Get a single product by ID
export const get = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new product (admin only - will add auth check later)
export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        image: v.optional(v.string()),
        occasion: v.string(),
        stock: v.number(),
    },
    handler: async (ctx, args) => {
        const productId = await ctx.db.insert("products", {
            ...args,
            createdAt: Date.now(),
        });
        return productId;
    },
});

// Update an existing product (admin only)
export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        image: v.optional(v.string()),
        occasion: v.optional(v.string()),
        stock: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // Filter out undefined values
        const cleanUpdates: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                cleanUpdates[key] = value;
            }
        }

        await ctx.db.patch(id, cleanUpdates);
        return id;
    },
});

// Delete a product (admin only)
export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    },
});
