"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";

interface AuthContextType {
    user: {
        id: string;
        name: string | null;
        email: string;
        image?: string | null;
        role?: string;
    } | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
});

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Use the Convex query to get the authenticated user from Better Auth
    const authUser = useQuery(api.auth.getCurrentUser);

    // Fetch user role from our users table
    const convexUser = useQuery(
        api.users.getByEmail,
        authUser?.email ? { email: authUser.email } : "skip"
    );

    // authUser === undefined means loading, null means not authenticated
    const isLoading = authUser === undefined || (authUser !== null && convexUser === undefined);

    // Debug logging
    React.useEffect(() => {
        console.log("🔍 Auth Debug State:", {
            authUser,
            convexUserFound: !!convexUser,
            convexUserRole: convexUser?.role,
            isLoading,
        });
    }, [authUser, convexUser, isLoading]);

    const value = React.useMemo(() => {
        const user = authUser && convexUser ? {
            id: String(authUser._id), // Convex uses _id
            name: authUser.name,
            email: authUser.email,
            image: authUser.image,
            role: convexUser.role,
        } : null;

        // Case-insensitive check
        const userRole = user?.role?.toUpperCase();
        const isAdmin = userRole === "ADMIN";

        return {
            user,
            isAuthenticated: !!authUser,
            isAdmin,
            isLoading,
        };
    }, [authUser, convexUser, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
