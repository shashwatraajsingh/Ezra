"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Upload,
    Loader2,
    CheckCircle,
    AlertTriangle,
    FileText,
    Sparkles,
    Plus,
    Trash2,
    Eye,
    Target,
    X,
    FolderPlus,
} from "lucide-react";
import { getToken } from "@/lib/api/auth";

// ─── Types ────────────────────────────────────────────────────────────────────
type TemplateKind = "prebuilt" | "user_uploaded";

interface TemplateData {
    id: number;
    name: string;
    description: string | null;
    kind: TemplateKind;
    fileRef: string | null;
    placeholders: string[] | null;
    createdAt: string;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function authHeaders() {
    return { Authorization: `Bearer ${getToken()}` };
}

async function fetchPrebuilt(): Promise<TemplateData[]> {
    const res = await fetch(`${API}/templates/prebuilt`, { headers: authHeaders() });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

async function fetchMine(): Promise<TemplateData[]> {
    const res = await fetch(`${API}/templates/mine`, { headers: authHeaders() });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

async function deleteTemplate(id: number): Promise<void> {
    await fetch(`${API}/templates/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
}

async function createResumeFromTemplate(
    templateId: number,
    title: string,
): Promise<{ id: number }> {
    const res = await fetch(`${API}/resumes`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ title, templateId }),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function GlassCard({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all ${onClick ? "cursor-pointer hover:bg-white/10 hover:border-white/20" : ""} ${className}`}
        >
            <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            {children}
        </div>
    );
}

function PlaceholderTag({ label }: { label: string }) {
    return (
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
            {`{{${label}}}`}
        </span>
    );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) { setFile(f); setName(name || f.name.replace(/\.[^.]+$/, "")); }
    };

    const handleSubmit = async () => {
        if (!file || !name.trim()) { setErr("Name and file are required"); return; }
        setUploading(true); setErr(null);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("name", name.trim());
            if (description) fd.append("description", description);
            const res = await fetch(`${API}/templates/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd,
            });
            if (!res.ok) throw new Error(await res.text());
            onSuccess();
            onClose();
        } catch (e) {
            setErr(String(e));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <GlassCard className="w-full max-w-md p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Upload Template</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drop zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 cursor-pointer hover:border-white/40 hover:bg-white/10 transition-all text-center"
                >
                    <Upload className="h-8 w-8 text-zinc-500" />
                    {file ? (
                        <p className="text-sm text-white font-medium">{file.name}</p>
                    ) : (
                        <div>
                            <p className="text-sm text-zinc-300 font-medium">Drop file here or click</p>
                            <p className="text-xs text-zinc-600 mt-1">.pdf · .docx · .tex — max 10 MB</p>
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,.docx,.tex"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { setFile(f); setName(name || f.name.replace(/\.[^.]+$/, "")); }
                        }}
                    />
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Template Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Custom Template"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Description (optional)</label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description…"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                        />
                    </div>
                </div>

                {err && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        {err}
                    </div>
                )}

                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-60"
                    >
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        {uploading ? "Processing…" : "Upload & Process"}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({
    tpl,
    onUse,
    onDelete,
}: {
    tpl: TemplateData;
    onUse: () => void;
    onDelete?: () => void;
}) {
    // Map template names to bg gradient colours for visual variety
    const gradients = [
        "from-purple-900/40 to-zinc-900/60",
        "from-blue-900/40 to-zinc-900/60",
        "from-emerald-900/40 to-zinc-900/60",
        "from-amber-900/40 to-zinc-900/60",
    ];
    const grad = gradients[tpl.id % gradients.length];

    return (
        <GlassCard className="flex flex-col">
            {/* Thumbnail area */}
            <div className={`h-36 bg-gradient-to-br ${grad} flex items-center justify-center border-b border-white/10`}>
                <FileText className="h-12 w-12 text-white/20" />
            </div>

            <div className="p-4 space-y-3 flex flex-col flex-1">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{tpl.name}</p>
                        {tpl.kind === "prebuilt" && (
                            <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-400">
                                Prebuilt
                            </span>
                        )}
                    </div>
                    {tpl.description && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{tpl.description}</p>
                    )}
                </div>

                {/* Placeholders preview */}
                {tpl.placeholders && tpl.placeholders.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {tpl.placeholders.slice(0, 4).map((p) => (
                            <PlaceholderTag key={p} label={p.replace(/[{}]/g, "")} />
                        ))}
                        {tpl.placeholders.length > 4 && (
                            <span className="text-[10px] text-zinc-600">
                                +{tpl.placeholders.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 mt-auto border-t border-white/10">
                    <button
                        onClick={onUse}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all"
                    >
                        <Plus className="h-3.5 w-3.5" /> Use Template
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                    </button>
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TemplatesPage() {
    const router = useRouter();
    const [prebuilt, setPrebuilt] = useState<TemplateData[]>([]);
    const [mine, setMine] = useState<TemplateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [activeTab, setActiveTab] = useState<"prebuilt" | "mine">("prebuilt");
    const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

    const notify = (msg: string, type: "ok" | "err" = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadData = useCallback(async () => {
        try {
            const [p, m] = await Promise.all([fetchPrebuilt(), fetchMine()]);
            setPrebuilt(p);
            setMine(m);
        } catch (e) {
            notify(String(e), "err");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (!token) { router.replace("/auth/login"); return; }
        loadData();
    }, [loadData, router]);

    const handleUse = async (tpl: TemplateData) => {
        try {
            const resume = await createResumeFromTemplate(tpl.id, `My ${tpl.name}`);
            router.push(`/resumes/${resume.id}`);
        } catch (e) {
            notify(String(e), "err");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTemplate(id);
            await loadData();
            notify("Template deleted");
        } catch (e) {
            notify(String(e), "err");
        }
    };

    const displayed = activeTab === "prebuilt" ? prebuilt : mine;

    return (
        <div className="relative min-h-screen bg-zinc-950 text-white font-sans">
            {/* Background */}
            <div
                className="fixed inset-0 z-0 bg-[url(/pricing.png)] bg-cover bg-center opacity-15 pointer-events-none"
                style={{
                    maskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                }}
            />
            <div className="fixed top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur-xl ${toast.type === "ok"
                        ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-300"
                        : "border-rose-500/30 bg-rose-950/80 text-rose-300"
                        }`}
                >
                    {toast.type === "ok" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Upload modal */}
            {showUpload && (
                <UploadModal onClose={() => setShowUpload(false)} onSuccess={loadData} />
            )}

            {/* Header */}
            <header className="relative z-20 sticky top-0 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-zinc-400" />
                            <span className="font-semibold text-white">Resume Templates</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/projects/new"
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
                        >
                            <FolderPlus className="h-4 w-4" /> New Project
                        </Link>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all"
                        >
                            <Upload className="h-4 w-4" /> Upload Template
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Hero text */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white">Choose a Template</h1>
                    <p className="text-sm text-zinc-500">
                        Select a professionally designed template or upload your own — our AI will extract the structure and generate LaTeX automatically.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 w-fit">
                    {(["prebuilt", "mine"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${activeTab === tab
                                ? "bg-white text-zinc-950 shadow"
                                : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            {tab === "prebuilt" ? "Prebuilt" : `My Templates${mine.length ? ` (${mine.length})` : ""}`}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
                    </div>
                ) : displayed.length === 0 ? (
                    <GlassCard className="p-16 flex flex-col items-center gap-5 text-center">
                        <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-zinc-600" />
                        </div>
                        <div>
                            <p className="text-white font-medium">No templates yet</p>
                            <p className="text-sm text-zinc-500 mt-1">Upload a .pdf, .docx, or .tex file to get started</p>
                        </div>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors"
                        >
                            <Upload className="h-4 w-4" /> Upload Template
                        </button>
                    </GlassCard>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {displayed.map((tpl) => (
                            <TemplateCard
                                key={tpl.id}
                                tpl={tpl}
                                onUse={() => handleUse(tpl)}
                                onDelete={tpl.kind === "user_uploaded" ? () => handleDelete(tpl.id) : undefined}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
