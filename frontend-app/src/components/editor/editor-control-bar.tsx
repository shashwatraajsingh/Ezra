import {
    CheckCircle,
    Code2,
    Download,
    Eye,
    LayoutList,
    Loader2,
    RefreshCw,
    Save,
    SplitSquareHorizontal,
} from "lucide-react";
import type { ResumeData, ViewMode } from "@/lib/types/resume.types";
import { StatusBadge } from "@/components/editor/status-badge";

interface EditorControlBarProps {
    resume: ResumeData;
    isDirty: boolean;
    isSaving: boolean;
    isCompiling: boolean;
    isDownloading: boolean;
    viewMode: ViewMode;
    saveMsg: string | null;
    onSave: () => void;
    onCompile: () => void;
    onDownload: () => void;
    onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODES: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
    { mode: "form", icon: LayoutList, label: "Form" },
    { mode: "editor", icon: Code2, label: "Code" },
    { mode: "split", icon: SplitSquareHorizontal, label: "Split" },
    { mode: "preview", icon: Eye, label: "Preview" },
];

export function EditorControlBar({
    resume,
    isDirty,
    isSaving,
    isCompiling,
    isDownloading,
    viewMode,
    saveMsg,
    onSave,
    onCompile,
    onDownload,
    onViewModeChange,
}: EditorControlBarProps) {
    return (
        <div className="relative z-20 flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl shrink-0">
            {/* Left — title + status */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate leading-tight">
                        {resume.title}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                        ATS {resume.atsScore}%
                        {" · "}
                        {new Date(resume.updatedAt).toLocaleTimeString()}
                    </p>
                </div>
                <StatusBadge status={resume.status} />
            </div>

            {/* Centre — view mode pill toggle */}
            <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md p-1 gap-0.5">
                {VIEW_MODES.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => onViewModeChange(mode)}
                        title={label}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${viewMode === mode
                                ? "bg-white text-zinc-950 shadow"
                                : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Right — status indicators + actions */}
            <div className="flex items-center gap-2">
                {saveMsg && (
                    <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" /> {saveMsg}
                    </span>
                )}
                {isDirty && !isSaving && (
                    <span className="text-xs text-zinc-500">Unsaved</span>
                )}

                {/* Save */}
                <button
                    onClick={onSave}
                    disabled={isSaving || !isDirty}
                    title="Save (Ctrl+S)"
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40"
                >
                    {isSaving
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Save className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">Save</span>
                </button>

                {/* Recompile */}
                <button
                    onClick={onCompile}
                    disabled={isCompiling}
                    title="Recompile"
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-60"
                >
                    {isCompiling
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <RefreshCw className="h-3.5 w-3.5" />}
                    Recompile
                </button>

                {/* Download PDF */}
                <button
                    onClick={onDownload}
                    disabled={isDownloading || resume.status !== "compiled"}
                    title={
                        resume.status !== "compiled"
                            ? "Compile first to enable download"
                            : "Download PDF"
                    }
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40"
                >
                    {isDownloading
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Download className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">Download</span>
                </button>
            </div>
        </div>
    );
}
