"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, onAuthChanged, signOutUser } from "@/lib/api/auth";

/**
 * Redirects to /auth/login if no token is present.
 * Returns a logout handler that clears the token and redirects to /.
 */
export function useAuth() {
    const router = useRouter();

    useEffect(() => {
        const syncAuth = () => {
            if (!getToken()) {
                router.replace("/auth/login");
            }
        };

        syncAuth();
        return onAuthChanged(syncAuth);
    }, [router]);

    const logout = async () => {
        await signOutUser();
        router.replace("/");
    };

    return { logout };
}
