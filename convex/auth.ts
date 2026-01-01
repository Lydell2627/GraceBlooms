import { convexAdapter } from "@convex-dev/better-auth";
import { betterAuth } from "better-auth";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.SITE_URL!;

export const createAuth = (ctx: any) => {
    return betterAuth({
        baseURL: siteUrl,
        database: convexAdapter(ctx, { adapter: internal.adapter } as any),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        },
    });
};

// Function for getting the current user - returns null if not authenticated
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        // In Library Mode, we can use the 'sessions' table directly to find the user
        // However, we don't have access to the request/cookies here in a Query.
        // The standard pattern is to use ctx.auth.getUserIdentity() if integrated with Convex Auth,
        // but Better Auth manages its own sessions.

        // Temporary fallback: The client logic in 'AuthProvider.tsx' might need adjustment
        // to call an Action instead of a Query if it needs to validate cookies?
        // Or we rely on 'better-auth/react' useSession on the client side mostly.

        // For now, return null to avoid compile errors while we fix data persistence.
        // We will fix this by using client-side auth state or a proper session lookup action.
        return null;
    },
});

