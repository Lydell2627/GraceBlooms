import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List messages between two users (real-time conversation)
export const list = query({
    args: {
        userId: v.string(),
        otherUserId: v.string(),
    },
    handler: async (ctx, args) => {
        // Get messages sent by current user to other user
        const sent = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("senderId", args.userId).eq("receiverId", args.otherUserId)
            )
            .collect();

        // Get messages sent by other user to current user
        const received = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("senderId", args.otherUserId).eq("receiverId", args.userId)
            )
            .collect();

        // Combine and sort by creation time
        const allMessages = [...sent, ...received].sort(
            (a, b) => a.createdAt - b.createdAt
        );

        return allMessages;
    },
});

// Get unread messages count for a user
export const getUnreadCount = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        return messages.length;
    },
});

// Send a new message
export const send = mutation({
    args: {
        content: v.string(),
        senderId: v.string(),
        senderName: v.optional(v.string()),
        receiverId: v.string(),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            content: args.content,
            senderId: args.senderId,
            senderName: args.senderName,
            receiverId: args.receiverId,
            isRead: false,
            createdAt: Date.now(),
        });

        return messageId;
    },
});

// Mark messages as read
export const markAsRead = mutation({
    args: {
        senderId: v.string(),
        receiverId: v.string(),
    },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) =>
                q.eq("senderId", args.senderId).eq("receiverId", args.receiverId)
            )
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        for (const message of messages) {
            await ctx.db.patch(message._id, { isRead: true });
        }

        return messages.length;
    },
});
