import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all orders (admin only)
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("orders")
            .order("desc")
            .collect();
    },
});

// Get orders for a specific user
export const getByUser = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Get a single order by ID
export const get = query({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create a new order
export const create = mutation({
    args: {
        userId: v.string(),
        userEmail: v.optional(v.string()),
        userName: v.optional(v.string()),
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
    },
    handler: async (ctx, args) => {
        const total = args.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const orderId = await ctx.db.insert("orders", {
            ...args,
            status: "PENDING",
            total,
            createdAt: Date.now(),
        });

        return orderId;
    },
});

// Update order status (admin only)
export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
        return args.id;
    },
});
