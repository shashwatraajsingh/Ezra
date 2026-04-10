"use client";

import { GoogleAuthCard } from "@/components/auth/google-auth-card";

export default function LoginPage() {
    return (
        <GoogleAuthCard
            title="Welcome Back"
            description="Continue with your Google account to access Ezra."
        />
    );
}
