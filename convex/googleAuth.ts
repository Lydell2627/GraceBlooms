import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Find or create user by Google sub (subject identifier)
export const findOrCreateByGoogleSub = mutation({
    args: {
        sub: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        picture: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // First, try to find by Google sub in accounts table
        const existingAccount = await ctx.db
            .query("accounts")
            .withIndex("by_accountId", (q) => q.eq("accountId", args.sub))
            .filter((q) => q.eq(q.field("providerId"), "google"))
            .first();

        if (existingAccount) {
            // User exists, return their info
            const user = await ctx.db.get(existingAccount.userId);
            return { userId: existingAccount.userId, user, isNew: false };
        }

        // Check if user exists with this email (could have signed up with email/password)
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingUser) {
            // Link Google account to existing user
            await ctx.db.insert("accounts", {
                userId: existingUser._id,
                accountId: args.sub,
                providerId: "google",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            return { userId: existingUser._id, user: existingUser, isNew: false };
        }

        // Create new user
        const now = Date.now();
        const userId = await ctx.db.insert("users", {
            email: args.email,
            name: args.name ?? "User",
            image: args.picture,
            emailVerified: true, // Google emails are verified
            role: "CUSTOMER",
            createdAt: now,
            updatedAt: now,
        });

        // Create account link
        await ctx.db.insert("accounts", {
            userId,
            accountId: args.sub,
            providerId: "google",
            createdAt: now,
            updatedAt: now,
        });

        const user = await ctx.db.get(userId);
        return { userId, user, isNew: true };
    },
});

// Get user by ID
export const getById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});
