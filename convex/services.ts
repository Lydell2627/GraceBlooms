import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List published services
export const list = query({
    args: {},
    handler: async (ctx) => {
        const services = await ctx.db
            .query("services")
            .withIndex("by_published", (q) => q.eq("published", true))
            .collect();
        return services.sort((a, b) => a.sortOrder - b.sortOrder);
    },
});

// Get single service
export const get = query({
    args: { id: v.id("services") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Admin: List all services
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("services").collect();
    },
});

// Admin: Create service
export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        icon: v.optional(v.string()),
        image: v.optional(v.string()),
        sortOrder: v.optional(v.number()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const existing = await ctx.db.query("services").collect();
        const maxOrder = existing.length > 0
            ? Math.max(...existing.map(s => s.sortOrder))
            : 0;

        const id = await ctx.db.insert("services", {
            title: args.title,
            description: args.description,
            icon: args.icon,
            image: args.image,
            sortOrder: args.sortOrder ?? maxOrder + 1,
            published: args.published ?? true,
            createdAt: now,
            updatedAt: now,
        });
        return id;
    },
});

// Admin: Update service
export const update = mutation({
    args: {
        id: v.id("services"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        image: v.optional(v.string()),
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

// Admin: Delete service
export const remove = mutation({
    args: { id: v.id("services") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    },
});
