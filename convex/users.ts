import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all users (admin only)
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

// Get user by email
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

// Get user by ID
export const get = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create or update user (upsert for auth sync)
export const upsert = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        role: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            // Update existing user
            await ctx.db.patch(existing._id, {
                name: args.name ?? existing.name,
                image: args.image ?? existing.image,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            // Create new user
            const now = Date.now();
            const userId = await ctx.db.insert("users", {
                email: args.email,
                name: args.name ?? "",
                image: args.image,
                emailVerified: false,
                role: args.role ?? "CUSTOMER",
                createdAt: now,
                updatedAt: now,
            });
            return userId;
        }
    },
});

// Update user role (admin only)
export const updateRole = mutation({
    args: {
        id: v.id("users"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { role: args.role });
        return args.id;
    },
});
