"use client";

import { useParams } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

import { NavBarDemo } from "@/app/demo";
import { useResumeEditor } from "@/hooks/use-resume-editor";
import { EditorControlBar } from "@/components/editor/editor-control-bar";
import { CompileErrorBanner } from "@/components/editor/compile-error-banner";
import { LatexEditorPane } from "@/components/editor/latex-editor-pane";
import { PreviewPane } from "@/components/editor/preview-pane";

export default function ResumeEditorPage() {
    const { id } = useParams<{ id: string }>();

    const {
        resume,
        latex,
        isDirty,
        isSaving,
        isCompiling,
        viewMode,
        error,
        saveMsg,
        setLatex,
        setViewMode,
        handleSave,
        handleCompile,
        dismissError,
    } = useResumeEditor(id);

    // ── Loading / fatal error ─────────────────────────────────────────────────
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

    // ── Editor layout ─────────────────────────────────────────────────────────
    return (
        <div className="h-screen flex flex-col bg-zinc-950 text-white font-sans overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-[url(/pricing.png)] bg-cover bg-center opacity-10 pointer-events-none" />
            <div className="fixed top-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />

            {/* ── Shared tubelight navbar (fixed floating pill) ───────────── */}
            <NavBarDemo />

            {/* ── Secondary bar: editor-specific controls ─────────────────── */}
            {/*  mt-14 so it sits just below the floating navbar on desktop   */}
            <div className="mt-14 shrink-0">
                <EditorControlBar
                    resume={resume}
                    isDirty={isDirty}
                    isSaving={isSaving}
                    isCompiling={isCompiling}
                    viewMode={viewMode}
                    saveMsg={saveMsg}
                    onSave={() => handleSave()}
                    onCompile={handleCompile}
                    onViewModeChange={setViewMode}
                />
            </div>

            {/* ── Compile error banner ─────────────────────────────────────── */}
            {error && (
                <CompileErrorBanner error={error} onDismiss={dismissError} />
            )}

            {/* ── Editor panes ─────────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-1 overflow-hidden gap-2 p-3">
                {(viewMode === "editor" || viewMode === "split") && (
                    <div className={viewMode === "split" ? "w-1/2" : "w-full"}>
                        <LatexEditorPane value={latex} onChange={setLatex} />
                    </div>
                )}

                {(viewMode === "preview" || viewMode === "split") && (
                    <div className={viewMode === "split" ? "w-1/2" : "w-full"}>
                        <PreviewPane resume={resume} isCompiling={isCompiling} />
                    </div>
                )}
            </div>
        </div>
    );
}
