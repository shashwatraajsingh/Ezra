"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    Upload,
    Brain,
    Star,
    Clock,
    GraduationCap,
    BookOpen,
    Mail,
    LogOut,
    Plus,
    Download,
    Eye,
    Trash2,
    Sparkles,
    Target,
    TrendingUp,
    ChevronRight,
    User,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface StudentData {
    name: string;
    email: string;
    branch: string;
    college: string;
    numberOfResumes: number;
    aiCredit: number;
    createdAt: string;
    resume: string | null;
}

// ─── Mock resume data (replace with real API when ready) ─────────────────────
const MOCK_RESUMES = [
    {
        id: 1,
        title: "Software Engineer Resume",
        updatedAt: "2026-02-28",
        atsScore: 94,
        status: "ATS Optimised",
    },
    {
        id: 2,
        title: "Full Stack Developer — Google",
        updatedAt: "2026-02-20",
        atsScore: 87,
        status: "ATS Optimised",
    },
    {
        id: 3,
        title: "Backend Engineer — Internship",
        updatedAt: "2026-01-15",
        atsScore: 78,
        status: "Needs Review",
    },
];

const MOCK_TEMPLATES = [
    { id: 1, title: "My Custom LaTeX Template", uploadedAt: "2026-01-10" },
    { id: 2, title: "Two-Column Modern", uploadedAt: "2025-12-05" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function GlassCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ${className}`}
        >
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            {children}
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    accent,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
}) {
    return (
        <GlassCard className="p-6 flex items-start gap-4">
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 ${accent ?? "bg-white/10"}`}
            >
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {label}
                </p>
                <p className="mt-1 text-2xl font-bold text-white">{value}</p>
                {sub && (
                    <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>
                )}
            </div>
        </GlassCard>
    );
}

function AtsBar({ score }: { score: number }) {
    const color =
        score >= 90
            ? "from-emerald-400 to-green-500"
            : score >= 75
                ? "from-yellow-400 to-amber-500"
                : "from-red-400 to-rose-500";
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span className="text-xs font-semibold text-zinc-300 w-8 text-right">
                {score}%
            </span>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const [student, setStudent] = useState<StudentData | null>(null);
    const [activeTab, setActiveTab] = useState<"resumes" | "templates">("resumes");

    useEffect(() => {
        const token =
            localStorage.getItem("access_token") ||
            localStorage.getItem("token") ||
            localStorage.getItem("jwt");

        if (!token) {
            router.replace("/auth/login");
            return;
        }

        // Try to decode JWT payload for basic info while full profile loads
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // Fallback mock data — replace with real API call
            setStudent({
                name: payload.name ?? "Shashwat Singh",
                email: payload.email ?? "shashwat@example.com",
                branch: payload.branch ?? "Computer Science",
                college: payload.college ?? "IIIT Allahabad",
                numberOfResumes: 3,
                aiCredit: 120,
                createdAt: payload.iat
                    ? new Date(payload.iat * 1000).toISOString()
                    : new Date().toISOString(),
                resume: null,
            });
        } catch {
            // If decode fails, use placeholder data
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
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        localStorage.removeItem("jwt");
        router.replace("/");
    };

    if (!student) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <p className="text-zinc-500 text-sm">Loading your dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden">
            {/* ── Background image ── */}
            <div
                className="fixed inset-0 z-0 bg-[url(/pricing.png)] bg-cover bg-center opacity-20 pointer-events-none"
                style={{
                    maskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                }}
            />
            {/* Ambient glows */}
            <div className="fixed top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none z-0" />

            {/* ── Top Navigation ── */}
            <header className="relative z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                            <Target className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-white tracking-tight">Ezra</span>
                        <span className="hidden sm:block h-4 w-px bg-white/10" />
                        <span className="hidden sm:block text-sm text-zinc-500">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                            <span className="text-xs font-medium text-zinc-300">
                                {student.aiCredit} AI Credits
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">

                {/* ── Profile greeting ── */}
                <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/20 to-white/5 text-xl font-bold text-white shadow-xl backdrop-blur-sm">
                            {getInitials(student.name)}
                            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-1">
                                Welcome back
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                                {student.name}
                            </h1>
                            <p className="text-sm text-zinc-400">{student.email}</p>
                        </div>
                    </div>

                    <button className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all">
                        <Plus className="h-4 w-4" />
                        New Resume
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </section>

                {/* ── Stats row ── */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={FileText}
                        label="Resumes Made"
                        value={student.numberOfResumes}
                        sub="All time"
                        accent="bg-blue-500/20"
                    />
                    <StatCard
                        icon={Sparkles}
                        label="AI Credits"
                        value={student.aiCredit}
                        sub="Available"
                        accent="bg-yellow-500/20"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Avg ATS Score"
                        value="86%"
                        sub="Across all resumes"
                        accent="bg-emerald-500/20"
                    />
                    <StatCard
                        icon={Clock}
                        label="Member Since"
                        value={formatDate(student.createdAt)}
                        accent="bg-purple-500/20"
                    />
                </section>

                {/* ── Profile detail card ── */}
                <section>
                    <GlassCard className="p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-5 flex items-center gap-2">
                            <User className="h-4 w-4" /> Profile Details
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Mail, label: "Email", value: student.email },
                                { icon: BookOpen, label: "Branch", value: student.branch },
                                { icon: GraduationCap, label: "College", value: student.college },
                                {
                                    icon: Star,
                                    label: "Plan",
                                    value: "Starter",
                                    badge: true,
                                },
                            ].map(({ icon: Icon, label, value, badge }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                                        <Icon className="h-4 w-4 text-zinc-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white truncate">
                                                {value}
                                            </p>
                                            {badge && (
                                                <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </section>

                {/* ── Tabs: Resumes / Templates ── */}
                <section className="space-y-5">
                    {/* Tab switcher */}
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

                        {activeTab === "templates" && (
                            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
                                <Upload className="h-4 w-4" />
                                Upload Template
                            </button>
                        )}
                    </div>

                    {/* ── Resumes Tab ── */}
                    {activeTab === "resumes" && (
                        <div className="space-y-3">
                            {MOCK_RESUMES.length === 0 ? (
                                <GlassCard className="p-12 flex flex-col items-center gap-4 text-center">
                                    <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">No resumes yet</p>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            Create your first AI-powered resume
                                        </p>
                                    </div>
                                    <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors">
                                        <Plus className="h-4 w-4" /> New Resume
                                    </button>
                                </GlassCard>
                            ) : (
                                MOCK_RESUMES.map((resume) => (
                                    <GlassCard key={resume.id} className="p-5">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {/* Icon */}
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                                                <FileText className="h-5 w-5 text-white" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-white text-sm truncate">
                                                        {resume.title}
                                                    </p>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${resume.status === "ATS Optimised"
                                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                                            }`}
                                                    >
                                                        {resume.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <AtsBar score={resume.atsScore} />
                                                    <span className="text-[10px] text-zinc-500 whitespace-nowrap shrink-0">
                                                        Updated {formatDate(resume.updatedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── Templates Tab ── */}
                    {activeTab === "templates" && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Upload card */}
                            <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 text-center border-dashed cursor-pointer hover:bg-white/10 transition-colors min-h-[160px] group">
                                <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Upload className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300">
                                        Upload Template
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-0.5">
                                        .tex, .pdf, .docx
                                    </p>
                                </div>
                            </GlassCard>

                            {/* Existing templates */}
                            {MOCK_TEMPLATES.map((tpl) => (
                                <GlassCard key={tpl.id} className="p-5 space-y-4">
                                    {/* Preview placeholder */}
                                    <div className="h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Brain className="h-8 w-8 text-zinc-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white truncate">
                                            {tpl.title}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            Uploaded {formatDate(tpl.uploadedAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                                        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
                                            <Eye className="h-3.5 w-3.5" /> Preview
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors">
                                            <Sparkles className="h-3.5 w-3.5" /> Use
                                        </button>
                                        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Quick actions footer strip ── */}
                <section>
                    <GlassCard className="p-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                                    <Sparkles className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Upgrade to Business
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Unlock unlimited resumes & advanced AI features
                                    </p>
                                </div>
                            </div>
                            <button className="shrink-0 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all">
                                View Plans
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </GlassCard>
                </section>
            </main>
        </div>
    );
}
