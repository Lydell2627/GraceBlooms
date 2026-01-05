import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const convexSiteUrl = process.env.CONVEX_SITE_URL || process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

console.log("🔒 Auth Server Config:", {
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
    convexSiteUrl: convexSiteUrl,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET ? "set" : "missing",
});

export const {
    handler,
    preloadAuthQuery,
    isAuthenticated,
    getToken,
    fetchAuthQuery,
    fetchAuthMutation,
    fetchAuthAction,
} = convexBetterAuthNextJs({
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
    convexSiteUrl: convexSiteUrl!,
});
