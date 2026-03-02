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

export function clearAuth(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
}
