"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { NavBarDemo } from "@/app/demo";
import { useAuth } from "@/hooks/use-auth";
import { getToken } from "@/lib/api/auth";
import type { StudentData } from "@/lib/types/student.types";
import type { ResumeSummary } from "@/lib/types/resume.types";

import { ProfileGreeting } from "@/components/dashboard/profile-greeting";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ProfileDetailsCard } from "@/components/dashboard/profile-details-card";
import { ResumesTab } from "@/components/dashboard/resumes-tab";
import { TemplatesTab } from "@/components/dashboard/templates-tab";
import { UpgradeStrip } from "@/components/dashboard/upgrade-strip";

// ─── Placeholder data — replace with real API calls ──────────────────────────
const MOCK_RESUMES: ResumeSummary[] = [
    { id: 1, title: "Software Engineer Resume", updatedAt: "2026-02-28", atsScore: 94, status: "ATS Optimised" },
    { id: 2, title: "Full Stack Developer — Google", updatedAt: "2026-02-20", atsScore: 87, status: "ATS Optimised" },
    { id: 3, title: "Backend Engineer — Internship", updatedAt: "2026-01-15", atsScore: 78, status: "Needs Review" },
];

const MOCK_TEMPLATES = [
    { id: 1, title: "My Custom LaTeX Template", uploadedAt: "2026-01-10" },
    { id: 2, title: "Two-Column Modern", uploadedAt: "2025-12-05" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const { logout } = useAuth();

    const [student, setStudent] = useState<StudentData | null>(null);
    const [activeTab, setActiveTab] = useState<"resumes" | "templates">("resumes");

    useEffect(() => {
        const token = getToken();
        if (!token) return;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setStudent({
                name: payload.name ?? "Shashwat Singh",
                email: payload.email ?? "student@example.com",
                branch: payload.branch ?? "Computer Science",
                college: payload.college ?? "IIIT Allahabad",
                numberOfResumes: MOCK_RESUMES.length,
                aiCredit: 120,
                createdAt: payload.iat
                    ? new Date(payload.iat * 1000).toISOString()
                    : new Date().toISOString(),
                resume: null,
            });
        } catch {
            setStudent({
                name: "Student",
                email: "student@example.com",
                branch: "Engineering",
                college: "University",
                numberOfResumes: 0,
                aiCredit: 0,
                createdAt: new Date().toISOString(),
                resume: null,
            });
        }
    }, []);

    if (!student) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden">
            {/* Background */}
            <div
                className="fixed inset-0 z-0 bg-[url(/pricing.png)] bg-cover bg-center opacity-20 pointer-events-none"
                style={{
                    maskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                }}
            />
            <div className="fixed top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none z-0" />

            {/* ── Shared tubelight navbar ─────────────────────────────────── */}
            <NavBarDemo />

            {/* ── Content — pt-24 to clear the fixed floating navbar ─────── */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10">
                <ProfileGreeting
                    name={student.name}
                    email={student.email}
                    aiCredit={student.aiCredit}
                    onNewResume={() => router.push("/templates")}
                    onLogout={logout}
                />

                <StatsRow
                    numberOfResumes={student.numberOfResumes}
                    aiCredit={student.aiCredit}
                    createdAt={student.createdAt}
                />

                <ProfileDetailsCard student={student} />

                {/* ── Content tabs ── */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex rounded-full border border-white/10 bg-white/5 p-1 gap-1">
                            {(["resumes", "templates"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${activeTab === tab
                                            ? "bg-white text-zinc-950 shadow"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    {tab === "resumes" ? "My Resumes" : "My Templates"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === "resumes" && (
                        <ResumesTab
                            resumes={MOCK_RESUMES}
                            onDelete={(id) => console.log("delete resume", id)}
                        />
                    )}

                    {activeTab === "templates" && (
                        <TemplatesTab
                            templates={MOCK_TEMPLATES}
                            onUpload={() => router.push("/templates")}
                            onDelete={(id) => console.log("delete template", id)}
                        />
                    )}
                </section>

                <UpgradeStrip />
            </main>
        </div>
    );
}
