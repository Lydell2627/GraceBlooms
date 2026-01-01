import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Products table
    products: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        image: v.optional(v.string()),
        occasion: v.string(), // WEDDING, BIRTHDAY, FUNERAL, ANNIVERSARY
        stock: v.number(),
        createdAt: v.number(), // timestamp
    })
        .index("by_occasion", ["occasion"])
        .searchIndex("search_name", { searchField: "name" }),

    // Orders table
    orders: defineTable({
        userId: v.string(),
        userEmail: v.optional(v.string()),
        userName: v.optional(v.string()),
        status: v.string(), // PENDING, PROCESSING, DELIVERED, CANCELLED
        total: v.number(),
        items: v.array(
            v.object({
                productId: v.id("products"),
                productName: v.string(),
                quantity: v.number(),
                price: v.number(),
            })
        ),
        shippingAddress: v.optional(
            v.object({
                firstName: v.string(),
                lastName: v.string(),
                address: v.string(),
                city: v.string(),
                state: v.string(),
                zip: v.string(),
            })
        ),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_status", ["status"]),

    // Users table (Updated for Better Auth)
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        emailVerified: v.boolean(),
        role: v.optional(v.string()), // Kept for app logic (ADMIN/CUSTOMER)
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_email", ["email"]),

    // Better Auth Tables
    sessions: defineTable({
        userId: v.id("users"),
        token: v.string(),
        expiresAt: v.number(),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_token", ["token"])
        .index("by_userId", ["userId"]),

    accounts: defineTable({
        userId: v.id("users"),
        accountId: v.string(),
        providerId: v.string(),
        accessToken: v.optional(v.string()),
        refreshToken: v.optional(v.string()),
        expiresAt: v.optional(v.number()),
        password: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_accountId", ["accountId"]),

    verifications: defineTable({
        identifier: v.string(),
        value: v.string(),
        expiresAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_identifier", ["identifier"]),

    // Messages table for real-time chat
    messages: defineTable({
        content: v.string(),
        senderId: v.string(),
        senderName: v.optional(v.string()),
        receiverId: v.string(),
        isRead: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_conversation", ["senderId", "receiverId"])
        .index("by_receiver", ["receiverId"]),
});
