import { mutation } from "./_generated/server";

// Seed initial data for the catalog
export const seedAll = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Check if already seeded
        const existingItems = await ctx.db.query("catalogItems").collect();
        if (existingItems.length > 0) {
            return { message: "Already seeded", skipped: true };
        }

        // Seed Catalog Items (8 items)
        const catalogItems = [
            {
                title: "Eternal Rose Bouquet",
                slug: "eternal-rose-bouquet",
                category: "ANNIVERSARY",
                shortDescription: "Classic red roses for eternal love",
                description: "A stunning arrangement of 24 premium long-stem red roses, symbolizing eternal love and devotion. Perfect for anniversaries and romantic gestures. Each rose is hand-selected for quality and freshness.",
                priceMin: 2500,
                priceMax: 4500,
                currency: "INR",
                tags: ["featured", "bestseller"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"],
                customizationAvailable: true,
                leadTimeDays: 1,
                deliveryNotes: "Available for same-day delivery if ordered before 2 PM",
                published: true,
            },
            {
                title: "Bridal Dream Collection",
                slug: "bridal-dream-collection",
                category: "WEDDING",
                shortDescription: "Elegant white blooms for your special day",
                description: "An exquisite bridal collection featuring pristine white roses, delicate peonies, and lush greenery. Includes bridal bouquet, bridesmaids bouquets, and boutonnières. Customizable to match your wedding theme.",
                priceMin: 8000,
                priceMax: 25000,
                currency: "INR",
                tags: ["featured", "new"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMgz19w4ualML4DajYpfn8mBi1RTGIFctgOHro"],
                customizationAvailable: true,
                leadTimeDays: 3,
                deliveryNotes: "Consultation required. Contact us for wedding packages.",
                published: true,
            },
            {
                title: "Sunrise Celebration",
                slug: "sunrise-celebration",
                category: "BIRTHDAY",
                shortDescription: "Vibrant blooms to brighten any birthday",
                description: "A cheerful arrangement of sunflowers, gerberas, and colorful mixed blooms. This vibrant bouquet brings joy and celebration to any birthday party.",
                priceMin: 1800,
                priceMax: 3200,
                currency: "INR",
                tags: ["bestseller"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMP6rqR2S4CqkKBeOpjAJhMcQ0IZSFi3xlE4sU"],
                customizationAvailable: true,
                leadTimeDays: 1,
                published: true,
            },
            {
                title: "Peaceful Remembrance",
                slug: "peaceful-remembrance",
                category: "SYMPATHY",
                shortDescription: "Graceful tribute for cherished memories",
                description: "A serene arrangement of white lilies, chrysanthemums, and soft greenery. This tasteful tribute offers comfort during difficult times while honoring cherished memories.",
                priceMin: 3000,
                priceMax: 6000,
                currency: "INR",
                tags: [],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMyQeZhG7opIwWKlVO4xCf0dFXALQ7JUBujHkz"],
                customizationAvailable: true,
                leadTimeDays: 1,
                deliveryNotes: "Funeral and memorial delivery available",
                published: true,
            },
            {
                title: "Pastel Paradise",
                slug: "pastel-paradise",
                category: "CUSTOM",
                shortDescription: "Soft pastels for any occasion",
                description: "A dreamy combination of soft pink roses, lavender, and cream-colored blooms. This versatile arrangement suits any occasion from thank-you gestures to home décor.",
                priceMin: 2000,
                priceMax: 3500,
                currency: "INR",
                tags: ["seasonal", "new"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QM5cnd4yUj4at0SrcIVxTMmfYzNpQnWXGdAHsF"],
                customizationAvailable: true,
                leadTimeDays: 2,
                published: true,
            },
            {
                title: "Royal Orchid Elegance",
                slug: "royal-orchid-elegance",
                category: "CUSTOM",
                shortDescription: "Exotic orchids for sophisticated tastes",
                description: "Premium phalaenopsis orchids arranged in an elegant ceramic vase. Long-lasting beauty that brings sophistication to any space. Available in white, purple, or mixed colors.",
                priceMin: 3500,
                priceMax: 7000,
                currency: "INR",
                tags: ["featured"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMjWc9ubBQFa39zYTI6ZLMgsqoDXWvHbV10xUn"],
                customizationAvailable: true,
                leadTimeDays: 2,
                published: true,
            },
            {
                title: "Garden Fresh Basket",
                slug: "garden-fresh-basket",
                category: "BIRTHDAY",
                shortDescription: "Country charm in a rustic basket",
                description: "A charming arrangement of seasonal mixed flowers presented in a woven basket. Includes roses, carnations, daisies, and lush greenery for a garden-fresh feel.",
                priceMin: 1500,
                priceMax: 2800,
                currency: "INR",
                tags: ["seasonal"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMP6rqR2S4CqkKBeOpjAJhMcQ0IZSFi3xlE4sU"],
                customizationAvailable: true,
                leadTimeDays: 1,
                published: true,
            },
            {
                title: "Luxury Valentine Box",
                slug: "luxury-valentine-box",
                category: "ANNIVERSARY",
                shortDescription: "Premium roses in a keepsake box",
                description: "36 premium Ecuadorian red roses arranged in a luxurious velvet heart-shaped box. The ultimate romantic gesture that creates lasting memories.",
                priceMin: 5000,
                priceMax: 9000,
                currency: "INR",
                tags: ["featured", "bestseller"],
                images: ["https://2lcifuj23a.ufs.sh/f/7mwewDydS8QMgz19w4ualML4DajYpfn8mBi1RTGIFctgOHro"],
                customizationAvailable: false,
                leadTimeDays: 2,
                deliveryNotes: "Gift message included. Available with chocolates upgrade.",
                published: true,
            },
        ];

        for (const item of catalogItems) {
            await ctx.db.insert("catalogItems", {
                ...item,
                createdAt: now,
                updatedAt: now,
            });
        }

        // Seed Services (5 services)
        const services = [
            {
                title: "Wedding Florals",
                description: "Complete wedding floral design including bridal bouquets, centerpieces, ceremony arrangements, and venue decoration. We work closely with you to bring your dream wedding to life.",
                icon: "Heart",
                sortOrder: 1,
                published: true,
            },
            {
                title: "Corporate Events",
                description: "Professional floral arrangements for corporate events, conferences, and office spaces. Regular subscriptions available for office flower programs.",
                icon: "Building2",
                sortOrder: 2,
                published: true,
            },
            {
                title: "Custom Bouquets",
                description: "Create your perfect bouquet with our custom design service. Choose your flowers, colors, and style, and our expert florists will craft something unique just for you.",
                icon: "Palette",
                sortOrder: 3,
                published: true,
            },
            {
                title: "Subscription Service",
                description: "Fresh flowers delivered weekly, bi-weekly, or monthly to your home or office. Keep your space vibrant with seasonal blooms curated by our designers.",
                icon: "CalendarDays",
                sortOrder: 4,
                published: true,
            },
            {
                title: "Same-Day Delivery",
                description: "Order before 2 PM for same-day delivery within city limits. Perfect for last-minute gifts and urgent celebrations.",
                icon: "Truck",
                sortOrder: 5,
                published: true,
            },
        ];

        for (const service of services) {
            await ctx.db.insert("services", {
                ...service,
                createdAt: now,
                updatedAt: now,
            });
        }

        // Seed FAQs (10 FAQs)
        const faqs = [
            {
                question: "How do I place an order?",
                answer: "You can browse our catalog and contact us via WhatsApp, phone, or email to place an order. Our team will help you customize your arrangement and arrange delivery.",
                category: "general",
                sortOrder: 1,
            },
            {
                question: "What are your delivery areas?",
                answer: "We deliver throughout the city and surrounding areas within a 25km radius. For locations outside this range, please contact us for availability and additional charges.",
                category: "delivery",
                sortOrder: 2,
            },
            {
                question: "Do you offer same-day delivery?",
                answer: "Yes! Orders placed before 2 PM can be delivered the same day within our standard delivery area. Same-day delivery is subject to availability.",
                category: "delivery",
                sortOrder: 3,
            },
            {
                question: "Can I customize my bouquet?",
                answer: "Absolutely! We love creating custom arrangements. Share your preferences for flowers, colors, and style, and our designers will create something perfect for your occasion.",
                category: "customization",
                sortOrder: 4,
            },
            {
                question: "What is your lead time for weddings?",
                answer: "We recommend booking wedding florals at least 3-6 months in advance. This allows time for consultations, design development, and ensuring availability of your preferred blooms.",
                category: "customization",
                sortOrder: 5,
            },
            {
                question: "How long will my flowers last?",
                answer: "With proper care, most arrangements last 5-7 days. We include care instructions with every delivery. Keep flowers in a cool location, change water regularly, and trim stems every few days.",
                category: "general",
                sortOrder: 6,
            },
            {
                question: "Do you offer refunds or replacements?",
                answer: "If you're not completely satisfied with your arrangement, please contact us within 24 hours of delivery. We'll work with you to make it right with a replacement or store credit.",
                category: "general",
                sortOrder: 7,
            },
            {
                question: "What payment methods do you accept?",
                answer: "We accept UPI, bank transfers, and cash on delivery. For wedding and large orders, we require a 50% advance with the balance due before delivery.",
                category: "payment",
                sortOrder: 8,
            },
            {
                question: "Can I send flowers as a gift?",
                answer: "Yes! We specialize in gift deliveries. Include a personalized message, and we'll ensure beautiful presentation with a handwritten card.",
                category: "general",
                sortOrder: 9,
            },
            {
                question: "Do you provide flowers for funerals?",
                answer: "We offer a range of sympathy arrangements including wreaths, standing sprays, and casket flowers. We handle these orders with care and can deliver directly to funeral homes.",
                category: "general",
                sortOrder: 10,
            },
        ];

        for (const faq of faqs) {
            await ctx.db.insert("faq", {
                ...faq,
                published: true,
                createdAt: now,
                updatedAt: now,
            });
        }

        // Initialize default settings
        const existingSettings = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", "site"))
            .first();

        if (!existingSettings) {
            await ctx.db.insert("settings", {
                key: "site",
                heroHeadline: "Emotions in Full Bloom",
                heroSubheadline: "Hand-crafted arrangements that speak the language of the heart. Contact us to order.",
                trustBadges: [
                    { icon: "Sparkles", title: "Freshness Guaranteed", description: "Sourced directly from local growers" },
                    { icon: "Truck", title: "Same Day Delivery", description: "Order by 2PM for immediate delivery" },
                    { icon: "Shield", title: "Artist Arrangements", description: "Hand-crafted by award-winning designers" },
                ],
                businessHours: "Mon-Sat: 9AM - 8PM, Sun: 10AM - 6PM",
                updatedAt: now,
            });
        }

        // Initialize AI settings
        const existingAI = await ctx.db
            .query("aiSettings")
            .withIndex("by_key", (q) => q.eq("key", "bot"))
            .first();

        if (!existingAI) {
            await ctx.db.insert("aiSettings", {
                key: "bot",
                enabled: true,
                systemPrompt: "You are Grace, the helpful assistant for Grace Blooms, a luxury flower boutique. Help customers find the perfect flowers for their occasions. Be warm, knowledgeable, and suggest arrangements from our catalog. Always quote exact price ranges from the catalog.",
                tone: "friendly",
                maxMemoryChunks: 50,
                updatedAt: now,
            });
        }

        return {
            message: "Seeded successfully",
            items: {
                catalogItems: catalogItems.length,
                services: services.length,
                faqs: faqs.length,
            },
        };
    },
});
