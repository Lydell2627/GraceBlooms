import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Catalog Items (replaces products)
    catalogItems: defineTable({
        title: v.string(),
        slug: v.string(),
        category: v.string(), // WEDDING, BIRTHDAY, ANNIVERSARY, SYMPATHY, CUSTOM, etc.
        shortDescription: v.string(),
        description: v.string(),
        priceMin: v.number(),
        priceMax: v.number(),
        currency: v.string(), // INR default
        tags: v.array(v.string()), // featured, new, seasonal, bestseller
        images: v.array(v.string()), // UploadThing URLs
        customizationAvailable: v.optional(v.boolean()),
        leadTimeDays: v.optional(v.number()),
        deliveryNotes: v.optional(v.string()),
        published: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_category", ["category"])
        .index("by_published", ["published"])
        .searchIndex("search_title", { searchField: "title" }),

    // Services
    services: defineTable({
        title: v.string(),
        description: v.string(),
        icon: v.optional(v.string()), // Lucide icon name
        image: v.optional(v.string()),
        sortOrder: v.number(),
        published: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_published", ["published"])
        .index("by_sortOrder", ["sortOrder"]),

    // Site Settings (singleton)
    settings: defineTable({
        key: v.string(), // 'site' for main settings
        whatsappNumber: v.optional(v.string()),
        whatsappMessage: v.optional(v.string()), // Default message template
        phoneNumber: v.optional(v.string()),
        email: v.optional(v.string()),
        heroHeadline: v.optional(v.string()),
        heroSubheadline: v.optional(v.string()),
        baseCurrency: v.optional(v.string()), // INR, USD, EUR, GBP, AED - currency for all stored prices
        trustBadges: v.optional(v.array(v.object({
            icon: v.string(),
            title: v.string(),
            description: v.string(),
        }))),
        socialLinks: v.optional(v.object({
            instagram: v.optional(v.string()),
            facebook: v.optional(v.string()),
            twitter: v.optional(v.string()),
            pinterest: v.optional(v.string()),
        })),
        businessHours: v.optional(v.string()),
        location: v.optional(v.string()),
        updatedAt: v.number(),
    }).index("by_key", ["key"]),

    // FAQ / Policies
    faq: defineTable({
        question: v.string(),
        answer: v.string(),
        category: v.string(), // delivery, customization, payment, general
        sortOrder: v.number(),
        published: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_category", ["category"])
        .index("by_published", ["published"]),


    // Contact Inquiries (for tracking)
    contactInquiries: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
        source: v.string(), // contact_form, catalog_inquiry
        catalogItemId: v.optional(v.id("catalogItems")),
        status: v.string(), // new, contacted, resolved
        createdAt: v.number(),
    })
        .index("by_status", ["status"])
        .index("by_createdAt", ["createdAt"]),

    // AI Bot Inquiries (bot-driven WhatsApp/Email)
    inquiries: defineTable({
        userId: v.string(), // authenticated user ID
        referenceId: v.string(), // user-facing reference (e.g., INQ-20260102-ABC123)
        selectedCatalogItemIds: v.optional(v.array(v.id("catalogItems"))),
        occasion: v.optional(v.string()),
        preferredColors: v.optional(v.string()),
        budgetMin: v.optional(v.number()),
        budgetMax: v.optional(v.number()),
        deliveryArea: v.optional(v.string()),
        eventDateTime: v.optional(v.string()),
        messageNote: v.optional(v.string()),
        contactName: v.string(),
        contactPhone: v.string(),
        contactEmail: v.string(),
        whatsappSent: v.boolean(),
        emailSent: v.boolean(),
        status: v.string(), // NEW, SENT, FAILED, CLOSED
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_status", ["status"])
        .index("by_referenceId", ["referenceId"])
        .index("by_createdAt", ["createdAt"]),

    // AI Bot - User Memory (per-user RAG)
    userMemory: defineTable({
        userId: v.string(),
        content: v.string(), // Memory chunk text
        embedding: v.optional(v.array(v.float64())), // Gemini embedding
        category: v.string(), // preference, inquiry, conversation
        createdAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_category", ["userId", "category"]),

    // AI Bot - Global Knowledge Embeddings
    knowledgeEmbeddings: defineTable({
        sourceType: v.string(), // catalog, faq, service
        sourceId: v.string(), // ID of source document
        content: v.string(), // Text content
        embedding: v.optional(v.array(v.float64())),
        updatedAt: v.number(),
    })
        .index("by_sourceType", ["sourceType"])
        .index("by_sourceId", ["sourceId"]),

    // AI Settings
    aiSettings: defineTable({
        key: v.string(), // 'bot' for bot settings
        enabled: v.boolean(),
        systemPrompt: v.optional(v.string()),
        tone: v.optional(v.string()), // friendly, professional, luxury
        maxMemoryChunks: v.optional(v.number()), // Per user limit
        updatedAt: v.number(),
    }).index("by_key", ["key"]),

    // Users table (Updated for Better Auth)
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        emailVerified: v.boolean(),
        role: v.optional(v.string()), // ADMIN/CUSTOMER
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

    // Messages table for real-time chat (bot conversations)
    messages: defineTable({
        userId: v.string(),
        role: v.string(), // user, assistant
        content: v.string(),
        createdAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_createdAt", ["userId", "createdAt"]),
});
