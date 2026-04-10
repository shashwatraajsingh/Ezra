"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LogIn } from "lucide-react";
import { signInWithPopup } from "firebase/auth";

import { exchangeGoogleToken, getToken } from "@/lib/api/auth";
import { firebaseAuth, googleProvider } from "@/lib/firebase/client";

type GoogleAuthCardProps = {
    title: string;
    description: string;
    footerText?: string;
    footerHref?: string;
    footerLinkLabel?: string;
};

export function GoogleAuthCard({
    title,
    description,
    footerText,
    footerHref,
    footerLinkLabel,
}: GoogleAuthCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (getToken()) {
            router.replace("/dashboard");
        }
    }, [router]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const idToken = await result.user.getIdToken();

            await exchangeGoogleToken(idToken);
            router.replace("/dashboard");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to sign in with Google.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center font-sans relative overflow-hidden px-6">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                style={{
                    backgroundImage: "url(/image.png)",
                    maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                }}
            />

            <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                    <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">{description}</p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full group inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                        {loading ? "Signing in..." : "Continue with Google"}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="mt-4 text-center text-xs text-zinc-500">
                        Email and password login has been removed. Google sign-in is the only auth flow.
                    </p>

                    {error ? (
                        <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {error}
                        </p>
                    ) : null}

                    {footerText && footerHref && footerLinkLabel ? (
                        <div className="mt-8 text-center text-sm text-zinc-400">
                            {footerText}{" "}
                            <Link href={footerHref} className="text-white hover:underline underline-offset-4 transition-colors">
                                {footerLinkLabel}
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
