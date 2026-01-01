import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { ConvexHttpClient } from "convex/browser";
import { api } from "~/convex/_generated/api";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// JWT secret for session tokens
const JWT_SECRET = new TextEncoder().encode(
    process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-change-me"
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { credential, g_csrf_token } = body;

        if (!credential) {
            return NextResponse.json(
                { error: "No credential provided" },
                { status: 400 }
            );
        }

        // Validate CSRF token if provided (from One Tap)
        if (g_csrf_token) {
            const cookieStore = await cookies();
            const csrfCookie = cookieStore.get("g_csrf_token");
            if (!csrfCookie || csrfCookie.value !== g_csrf_token) {
                return NextResponse.json(
                    { error: "Invalid CSRF token" },
                    { status: 400 }
                );
            }
        }

        // Verify the ID token with Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return NextResponse.json(
                { error: "Invalid token payload" },
                { status: 400 }
            );
        }

        // Check token expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return NextResponse.json(
                { error: "Token expired" },
                { status: 400 }
            );
        }

        // Extract user info
        const { sub, email, name, picture } = payload;

        if (!sub || !email) {
            return NextResponse.json(
                { error: "Missing required user info" },
                { status: 400 }
            );
        }

        // Find or create user in Convex
        const result = await convex.mutation(api.googleAuth.findOrCreateByGoogleSub, {
            sub,
            email,
            name: name || undefined,
            picture: picture || undefined,
        });

        // Create session JWT
        const sessionToken = await new SignJWT({
            userId: result.userId,
            email,
            name: result.user?.name,
            image: result.user?.image,
            provider: "google",
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: {
                id: result.userId,
                email,
                name: result.user?.name,
                image: result.user?.image,
            },
            isNew: result.isNew,
        });
    } catch (error) {
        console.error("Google auth error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("session");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sign out error:", error);
        return NextResponse.json(
            { error: "Sign out failed" },
            { status: 500 }
        );
    }
}
