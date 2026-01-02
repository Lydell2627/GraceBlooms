import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List catalog items with filtering and sorting
export const list = query({
    args: {
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
        published: v.optional(v.boolean()),
        sort: v.optional(v.string()), // featured, newest, price_asc, price_desc
    },
    handler: async (ctx, args) => {
        let items = await ctx.db.query("catalogItems").collect();

        // Filter by published (default to true for public)
        if (args.published !== undefined) {
            items = items.filter((item) => item.published === args.published);
        } else {
            items = items.filter((item) => item.published);
        }

        // Filter by category
        if (args.category) {
            items = items.filter(
                (item) => item.category.toLowerCase() === args.category!.toLowerCase()
            );
        }

        // Filter by tags (any match)
        if (args.tags && args.tags.length > 0) {
            items = items.filter((item) =>
                args.tags!.some((tag) =>
                    item.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
                )
            );
        }

        // Filter by budget range
        if (args.minPrice !== undefined) {
            items = items.filter((item) => item.priceMax >= args.minPrice!);
        }
        if (args.maxPrice !== undefined) {
            items = items.filter((item) => item.priceMin <= args.maxPrice!);
        }

        // Sort
        switch (args.sort) {
            case "newest":
                items.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case "price_asc":
                items.sort((a, b) => a.priceMin - b.priceMin);
                break;
            case "price_desc":
                items.sort((a, b) => b.priceMax - a.priceMax);
                break;
            case "featured":
            default:
                // Featured items first, then by creation date
                items.sort((a, b) => {
                    const aFeatured = a.tags.includes("featured") ? 1 : 0;
                    const bFeatured = b.tags.includes("featured") ? 1 : 0;
                    if (bFeatured !== aFeatured) return bFeatured - aFeatured;
                    return b.createdAt - a.createdAt;
                });
                break;
        }

        return items;
    },
});

// Get single item by slug
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const items = await ctx.db
            .query("catalogItems")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .collect();
        return items[0] ?? null;
    },
});

// Get single item by ID
export const get = query({
    args: { id: v.id("catalogItems") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get featured items (for homepage)
export const getFeatured = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const items = await ctx.db.query("catalogItems").collect();
        const featured = items
            .filter((item) => item.published && item.tags.includes("featured"))
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, args.limit ?? 8);
        return featured;
    },
});

// Get related items (same category, excluding current)
export const getRelated = query({
    args: {
        itemId: v.id("catalogItems"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const currentItem = await ctx.db.get(args.itemId);
        if (!currentItem) return [];

        const items = await ctx.db
            .query("catalogItems")
            .withIndex("by_category", (q) => q.eq("category", currentItem.category))
            .collect();

        return items
            .filter((item) => item._id !== args.itemId && item.published)
            .slice(0, args.limit ?? 4);
    },
});

// Search items by title
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query.trim()) return [];
        const results = await ctx.db
            .query("catalogItems")
            .withSearchIndex("search_title", (q) => q.search("title", args.query))
            .collect();
        return results.filter((item) => item.published);
    },
});

// Get all categories (for filters)
export const getCategories = query({
    args: {},
    handler: async (ctx) => {
        const items = await ctx.db.query("catalogItems").collect();
        const categories = [...new Set(items.filter((i) => i.published).map((i) => i.category))];
        return categories.sort();
    },
});

// Admin: Create catalog item
export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        category: v.string(),
        shortDescription: v.string(),
        description: v.string(),
        priceMin: v.number(),
        priceMax: v.number(),
        currency: v.optional(v.string()),
        tags: v.array(v.string()),
        images: v.array(v.string()),
        customizationAvailable: v.optional(v.boolean()),
        leadTimeDays: v.optional(v.number()),
        deliveryNotes: v.optional(v.string()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const id = await ctx.db.insert("catalogItems", {
            title: args.title,
            slug: args.slug,
            category: args.category,
            shortDescription: args.shortDescription,
            description: args.description,
            priceMin: args.priceMin,
            priceMax: args.priceMax,
            currency: args.currency ?? "INR",
            tags: args.tags,
            images: args.images,
            customizationAvailable: args.customizationAvailable,
            leadTimeDays: args.leadTimeDays,
            deliveryNotes: args.deliveryNotes,
            published: args.published ?? true,
            createdAt: now,
            updatedAt: now,
        });
        return id;
    },
});

// Admin: Update catalog item
export const update = mutation({
    args: {
        id: v.id("catalogItems"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        category: v.optional(v.string()),
        shortDescription: v.optional(v.string()),
        description: v.optional(v.string()),
        priceMin: v.optional(v.number()),
        priceMax: v.optional(v.number()),
        currency: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        images: v.optional(v.array(v.string())),
        customizationAvailable: v.optional(v.boolean()),
        leadTimeDays: v.optional(v.number()),
        deliveryNotes: v.optional(v.string()),
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

// Admin: Delete catalog item
export const remove = mutation({
    args: { id: v.id("catalogItems") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    },
});

// Admin: List all items (including unpublished)
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("catalogItems").order("desc").collect();
    },
});
