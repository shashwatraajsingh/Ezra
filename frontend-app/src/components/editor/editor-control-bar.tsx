import {
    CheckCircle,
    Code2,
    Eye,
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
    viewMode: ViewMode;
    saveMsg: string | null;
    onSave: () => void;
    onCompile: () => void;
    onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODES: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
    { mode: "editor", icon: Code2, label: "Code" },
    { mode: "split", icon: SplitSquareHorizontal, label: "Split" },
    { mode: "preview", icon: Eye, label: "Preview" },
];

/**
 * Secondary editor control bar — sits below the shared NavBar.
 * Handles: document title, view mode toggle, save, recompile.
 * Navigation (back to dashboard) is handled by the top-level NavBar.
 */
export function EditorControlBar({
    resume,
    isDirty,
    isSaving,
    isCompiling,
    viewMode,
    saveMsg,
    onSave,
    onCompile,
    onViewModeChange,
}: EditorControlBarProps) {
    return (
        <div className="relative z-20 flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl shrink-0">
            {/* Left — resume title + status */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate leading-tight">
                        {resume.title}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                        ATS {resume.atsScore}% · {new Date(resume.updatedAt).toLocaleTimeString()}
                    </p>
                </div>
                <StatusBadge status={resume.status} />
            </div>

            {/* Centre — view mode pill toggle */}
            <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md p-1 gap-1">
                {VIEW_MODES.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => onViewModeChange(mode)}
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

            {/* Right — save feedback + action buttons */}
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
                    onClick={onSave}
                    disabled={isSaving || !isDirty}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40"
                >
                    {isSaving
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Save className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">Save</span>
                </button>

                <button
                    onClick={onCompile}
                    disabled={isCompiling}
                    className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-60"
                >
                    {isCompiling
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <RefreshCw className="h-3.5 w-3.5" />}
                    Recompile
                </button>
            </div>
        </div>
    );
}
