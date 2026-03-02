"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getToken } from "@/lib/api/auth";

/**
 * Redirects to /auth/login if no token is present.
 * Returns a logout handler that clears the token and redirects to /.
 */
export function useAuth() {
    const router = useRouter();

    useEffect(() => {
        if (!getToken()) {
            router.replace("/auth/login");
        }
    }, [router]);

    const logout = () => {
        clearAuth();
        router.replace("/");
    };

    return { logout };
}
