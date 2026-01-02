import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List published FAQs
export const list = query({
    args: { category: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let items = await ctx.db
            .query("faq")
            .withIndex("by_published", (q) => q.eq("published", true))
            .collect();

        if (args.category) {
            items = items.filter(
                (item) => item.category.toLowerCase() === args.category!.toLowerCase()
            );
        }

        return items.sort((a, b) => a.sortOrder - b.sortOrder);
    },
});

// Get FAQ categories
export const getCategories = query({
    args: {},
    handler: async (ctx) => {
        const items = await ctx.db.query("faq").collect();
        const categories = [...new Set(items.filter((i) => i.published).map((i) => i.category))];
        return categories.sort();
    },
});

// Admin: List all FAQs
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("faq").collect();
    },
});

// Admin: Create FAQ
export const create = mutation({
    args: {
        question: v.string(),
        answer: v.string(),
        category: v.string(),
        sortOrder: v.optional(v.number()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const existing = await ctx.db.query("faq").collect();
        const maxOrder = existing.length > 0
            ? Math.max(...existing.map(f => f.sortOrder))
            : 0;

        const id = await ctx.db.insert("faq", {
            question: args.question,
            answer: args.answer,
            category: args.category,
            sortOrder: args.sortOrder ?? maxOrder + 1,
            published: args.published ?? true,
            createdAt: now,
            updatedAt: now,
        });
        return id;
    },
});

// Admin: Update FAQ
export const update = mutation({
    args: {
        id: v.id("faq"),
        question: v.optional(v.string()),
        answer: v.optional(v.string()),
        category: v.optional(v.string()),
        sortOrder: v.optional(v.number()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const cleanUpdates: Record<string, unknown> = { updatedAt: Date.now() };

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                cleanUpdates[key] = value;
            }
        }

        await ctx.db.patch(id, cleanUpdates);
        return id;
    },
});

// Admin: Delete FAQ
export const remove = mutation({
    args: { id: v.id("faq") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    },
});
