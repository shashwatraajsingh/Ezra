"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    RefreshCw,
    Save,
    AlertTriangle,
    CheckCircle,
    Loader2,
    Code2,
    Eye,
    SplitSquareHorizontal,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type ResumeStatus = "draft" | "compiled" | "error";

interface ResumeData {
    id: number;
    title: string;
    latexSource: string | null;
    compiledPdfPath: string | null;
    atsScore: number;
    status: ResumeStatus;
    compileError: string | null;
    updatedAt: string;
}

type ViewMode = "split" | "editor" | "preview";

// ─── API helpers ─────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function authHeaders() {
    const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt") ||
        "";
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function fetchResume(id: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch resume: ${res.statusText}`);
    return res.json();
}

async function saveResume(id: string, latex: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ latexSource: latex }),
    });
    if (!res.ok) throw new Error(`Save failed: ${res.statusText}`);
    return res.json();
}

async function compileResume(id: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}/compile`, {
        method: "POST",
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Compile failed: ${res.statusText}`);
    return res.json();
}

// ─── Glassmorphic helpers ─────────────────────────────────────────────────────
function GlassPanel({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden ${className}`}
        >
            <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            {children}
        </div>
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ResumeStatus }) {
    const map: Record<ResumeStatus, { label: string; cls: string }> = {
        draft: {
            label: "Draft",
            cls: "bg-zinc-500/20 border-zinc-500/30 text-zinc-400",
        },
        compiled: {
            label: "Compiled",
            cls: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
        },
        error: {
            label: "Error",
            cls: "bg-rose-500/20 border-rose-500/30 text-rose-400",
        },
    };
    const { label, cls } = map[status];
    return (
        <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}
        >
            {label}
        </span>
    );
}

// ─── Main editor page ─────────────────────────────────────────────────────────
export default function ResumeEditorPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params.id;

    const [resume, setResume] = useState<ResumeData | null>(null);
    const [latex, setLatex] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("split");
    const [error, setError] = useState<string | null>(null);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load resume on mount
    useEffect(() => {
        const token = localStorage.getItem("access_token") ||
            localStorage.getItem("token") ||
            localStorage.getItem("jwt");
        if (!token) { router.replace("/auth/login"); return; }

        fetchResume(id)
            .then((r) => {
                setResume(r);
                setLatex(r.latexSource ?? "");
            })
            .catch((e) => setError(String(e)));
    }, [id, router]);

    // Auto-save debounce (3 s after last keystroke)
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleLatexChange = (val: string) => {
        setLatex(val);
        setIsDirty(true);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => handleSave(val), 3000);
    };

    const handleSave = async (src: string = latex) => {
        if (!isDirty && src === latex) return;
        setIsSaving(true);
        try {
            const updated = await saveResume(id, src);
            setResume(updated);
            setIsDirty(false);
            setSaveMsg("Saved");
            setTimeout(() => setSaveMsg(null), 2000);
        } catch (e) {
            setError(String(e));
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompile = async () => {
        // Save first
        await handleSave();
        setIsCompiling(true);
        setError(null);
        try {
            const updated = await compileResume(id);
            setResume(updated);
            if (updated.status === "error") {
                setError(updated.compileError ?? "Compile failed");
            }
        } catch (e) {
            setError(String(e));
        } finally {
            setIsCompiling(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────
    if (!resume) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                {error ? (
                    <div className="text-center space-y-3">
                        <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
                        <p className="text-rose-400 text-sm">{error}</p>
                        <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm underline">
                            ← Back to dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
                        <p className="text-zinc-500 text-sm">Loading editor…</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-zinc-950 text-white font-sans overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-[url(/pricing.png)] bg-cover bg-center opacity-10 pointer-events-none" />
            <div className="fixed top-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />

            {/* ── Top bar ─────────────────────────────────────────────────────── */}
            <header className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl shrink-0">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <p className="text-sm font-semibold text-white leading-tight">
                            {resume.title}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                            ATS {resume.atsScore}% · Last saved{" "}
                            {new Date(resume.updatedAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <StatusBadge status={resume.status} />
                </div>

                {/* Centre — view mode toggle */}
                <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/5 p-1 gap-1">
                    {(
                        [
                            { mode: "editor" as ViewMode, icon: Code2, label: "Code" },
                            { mode: "split" as ViewMode, icon: SplitSquareHorizontal, label: "Split" },
                            { mode: "preview" as ViewMode, icon: Eye, label: "Preview" },
                        ] as const
                    ).map(({ mode, icon: Icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${viewMode === mode
                                ? "bg-white text-zinc-950 shadow"
                                : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {saveMsg && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle className="h-3.5 w-3.5" /> {saveMsg}
                        </span>
                    )}
                    {isDirty && !isSaving && (
                        <span className="text-xs text-zinc-500">Unsaved</span>
                    )}
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving || !isDirty}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40"
                    >
                        {isSaving ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Save className="h-3.5 w-3.5" />
                        )}
                        Save
                    </button>
                    <button
                        onClick={handleCompile}
                        disabled={isCompiling}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-60"
                    >
                        {isCompiling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Recompile
                    </button>
                </div>
            </header>

            {/* ── Compile error banner ─────────────────────────────────────────── */}
            {error && (
                <div className="relative z-20 flex items-start gap-3 px-4 py-3 bg-rose-950/60 border-b border-rose-500/30 shrink-0">
                    <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-rose-400">Compile Error</p>
                        <pre className="text-[11px] text-rose-300/80 mt-1 overflow-x-auto whitespace-pre-wrap max-h-24">
                            {error}
                        </pre>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-rose-400 hover:text-white text-xs"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* ── Main editing area ────────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-1 overflow-hidden gap-2 p-3">
                {/* LaTeX editor pane */}
                {(viewMode === "editor" || viewMode === "split") && (
                    <GlassPanel
                        className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}
                    >
                        {/* Editor header */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-2">
                                <Code2 className="h-4 w-4 text-zinc-500" />
                                <span className="text-xs font-medium text-zinc-400">
                                    LaTeX Source
                                </span>
                            </div>
                            <span className="text-[10px] text-zinc-600">
                                {latex.split("\n").length} lines
                            </span>
                        </div>

                        {/* Editor body */}
                        <textarea
                            ref={textareaRef}
                            value={latex}
                            onChange={(e) => handleLatexChange(e.target.value)}
                            spellCheck={false}
                            className="flex-1 resize-none bg-transparent text-sm text-zinc-200 font-mono p-4 focus:outline-none placeholder-zinc-700 leading-relaxed"
                            placeholder="% Start writing LaTeX here…"
                            style={{ tabSize: 2 }}
                        />
                    </GlassPanel>
                )}

                {/* Preview pane */}
                {(viewMode === "preview" || viewMode === "split") && (
                    <GlassPanel
                        className={`flex flex-col ${viewMode === "split" ? "w-1/2" : "w-full"}`}
                    >
                        {/* Preview header */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-zinc-500" />
                                <span className="text-xs font-medium text-zinc-400">
                                    Compiled Preview
                                </span>
                            </div>
                            {resume.status === "compiled" && resume.compiledPdfPath && (
                                <a
                                    href={`${API.replace('/api', '')}${resume.compiledPdfPath}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-zinc-500 hover:text-zinc-300 underline"
                                >
                                    Open PDF ↗
                                </a>
                            )}
                        </div>

                        {/* Preview body */}
                        <div className="flex-1 overflow-hidden">
                            {resume.status === "compiled" && resume.compiledPdfPath ? (
                                <iframe
                                    src={`${API.replace('/api', '')}${resume.compiledPdfPath}`}
                                    className="w-full h-full border-0 bg-white"
                                    title="Resume Preview"
                                />
                            ) : isCompiling ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                                    <Loader2 className="h-10 w-10 text-white/30 animate-spin" />
                                    <p className="text-zinc-500 text-sm">Compiling with pdflatex…</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
                                    <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                                        <RefreshCw className="h-6 w-6 text-zinc-600" />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 font-medium text-sm">
                                            No compiled preview yet
                                        </p>
                                        <p className="text-zinc-600 text-xs mt-1">
                                            Click <span className="text-white font-semibold">Recompile</span> to generate the PDF preview.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
