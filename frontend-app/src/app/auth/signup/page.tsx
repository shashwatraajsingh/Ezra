"use client";

import React from "react";
import { User, Mail, Lock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    return (
        <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Background elements to match the hero section */}
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                style={{
                    backgroundImage: "url(/image.png)",
                    maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                    WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
                }}
            />

            {/* Ambient glows */}
            <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg x-6">
                {/* Auth Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                    {/* Inner glowing effect */}
                    <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                            Join Ezra AI to automate your resume engineering
                        </p>
                    </div>

                    <form className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Shashwat Singh"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="shashwat@example.com"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Grid for Branch and College */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Branch</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Computer Science"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">College</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <GraduationCap className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Stanford Univ."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.98] mt-6"
                        >
                            Sign Up Free
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-white hover:underline underline-offset-4 transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
