import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get AI settings
export const getSettings = query({
    args: {},
    handler: async (ctx) => {
        const settings = await ctx.db
            .query("aiSettings")
            .withIndex("by_key", (q) => q.eq("key", "bot"))
            .first();
        return settings ?? {
            enabled: true,
            systemPrompt: "",
            tone: "friendly",
            maxMemoryChunks: 50,
        };
    },
});

// Admin: Update AI settings
export const updateSettings = mutation({
    args: {
        enabled: v.optional(v.boolean()),
        systemPrompt: v.optional(v.string()),
        tone: v.optional(v.string()),
        maxMemoryChunks: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("aiSettings")
            .withIndex("by_key", (q) => q.eq("key", "bot"))
            .first();

        const updates = { ...args, updatedAt: Date.now() };

        if (existing) {
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        } else {
            const id = await ctx.db.insert("aiSettings", {
                key: "bot",
                enabled: args.enabled ?? true,
                systemPrompt: args.systemPrompt,
                tone: args.tone ?? "friendly",
                maxMemoryChunks: args.maxMemoryChunks ?? 50,
                updatedAt: Date.now(),
            });
            return id;
        }
    },
});

// Store user memory
export const storeMemory = mutation({
    args: {
        userId: v.string(),
        content: v.string(),
        category: v.string(),
        embedding: v.optional(v.array(v.float64())),
    },
    handler: async (ctx, args) => {
        // Check memory limit
        const settings = await ctx.db
            .query("aiSettings")
            .withIndex("by_key", (q) => q.eq("key", "bot"))
            .first();
        const maxChunks = settings?.maxMemoryChunks ?? 50;

        const existingMemory = await ctx.db
            .query("userMemory")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        // If at limit, delete oldest
        if (existingMemory.length >= maxChunks) {
            const oldest = existingMemory.sort((a, b) => a.createdAt - b.createdAt)[0];
            if (oldest) {
                await ctx.db.delete(oldest._id);
            }
        }

        const id = await ctx.db.insert("userMemory", {
            userId: args.userId,
            content: args.content,
            category: args.category,
            embedding: args.embedding,
            createdAt: Date.now(),
        });
        return id;
    },
});

// Get user memory (for RAG retrieval)
export const getUserMemory = query({
    args: {
        userId: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const memory = await ctx.db
            .query("userMemory")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
        return memory.slice(0, args.limit ?? 20);
    },
});

// Clear user memory
export const clearUserMemory = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const memory = await ctx.db
            .query("userMemory")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        for (const item of memory) {
            await ctx.db.delete(item._id);
        }

        return { cleared: memory.length };
    },
});

// Store chat message
export const storeMessage = mutation({
    args: {
        userId: v.string(),
        role: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("messages", {
            userId: args.userId,
            role: args.role,
            content: args.content,
            createdAt: Date.now(),
        });
        return id;
    },
});

// Get chat history for user
export const getChatHistory = query({
    args: {
        userId: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
        return messages.slice(0, args.limit ?? 50).reverse();
    },
});

// Clear chat history for user
export const clearChatHistory = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        for (const msg of messages) {
            await ctx.db.delete(msg._id);
        }

        return { cleared: messages.length };
    },
});

// Store knowledge embedding (for global RAG)
export const storeKnowledge = mutation({
    args: {
        sourceType: v.string(),
        sourceId: v.string(),
        content: v.string(),
        embedding: v.optional(v.array(v.float64())),
    },
    handler: async (ctx, args) => {
        // Check if exists, update if so
        const existing = await ctx.db
            .query("knowledgeEmbeddings")
            .withIndex("by_sourceId", (q) => q.eq("sourceId", args.sourceId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                content: args.content,
                embedding: args.embedding,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            const id = await ctx.db.insert("knowledgeEmbeddings", {
                sourceType: args.sourceType,
                sourceId: args.sourceId,
                content: args.content,
                embedding: args.embedding,
                updatedAt: Date.now(),
            });
            return id;
        }
    },
});

// Get knowledge by source type
export const getKnowledge = query({
    args: { sourceType: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.sourceType) {
            return await ctx.db
                .query("knowledgeEmbeddings")
                .withIndex("by_sourceType", (q) => q.eq("sourceType", args.sourceType!))
                .collect();
        }
        return await ctx.db.query("knowledgeEmbeddings").collect();
    },
});
