import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const AUTH_CHANGED_EVENT = "ezra-auth-changed";

/** Returns the stored JWT token from localStorage (any key we use). */
export function getToken(): string {
    if (typeof window === "undefined") return "";
    return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt") ||
        ""
    );
}

export function authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${getToken()}` };
}

export function jsonHeaders(): Record<string, string> {
    return { ...authHeaders(), "Content-Type": "application/json" };
}

export function setToken(token: string): void {
    localStorage.setItem("access_token", token);
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }
}

export function clearAuth(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }
}

export async function exchangeGoogleToken(idToken: string): Promise<string> {
    const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
        throw new Error(`Google sign-in failed (${res.status})`);
    }

    const data = (await res.json()) as { accessToken: string };
    setToken(data.accessToken);
    return data.accessToken;
}

export async function signOutUser(): Promise<void> {
    clearAuth();
    await signOut(firebaseAuth).catch(() => undefined);
}

export function onAuthChanged(listener: () => void): () => void {
    window.addEventListener("storage", listener);
    window.addEventListener(AUTH_CHANGED_EVENT, listener);

    return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener(AUTH_CHANGED_EVENT, listener);
    };
}
