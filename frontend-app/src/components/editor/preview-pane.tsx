import { Eye, Loader2, RefreshCw } from "lucide-react";
import type { ResumeData } from "@/lib/types/resume.types";
import { PDF_BASE_URL } from "@/lib/api/resumes.api";

interface PreviewPaneProps {
    resume: ResumeData;
    isCompiling: boolean;
}

function EmptyPreview() {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-zinc-600" />
            </div>
            <div>
                <p className="text-zinc-400 font-medium text-sm">No compiled preview yet</p>
                <p className="text-zinc-600 text-xs mt-1">
                    Click{" "}
                    <span className="text-white font-semibold">Recompile</span>{" "}
                    to generate the PDF preview.
                </p>
            </div>
        </div>
    );
}

function CompilingPreview() {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-10 w-10 text-white/30 animate-spin" />
            <p className="text-zinc-500 text-sm">Compiling with pdflatex…</p>
        </div>
    );
}

export function PreviewPane({ resume, isCompiling }: PreviewPaneProps) {
    const pdfUrl =
        resume.status === "compiled" && resume.compiledPdfPath
            ? `${PDF_BASE_URL}${resume.compiledPdfPath}`
            : null;

    return (
        <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            {/* Pane header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400">Compiled Preview</span>
                </div>
                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 underline"
                    >
                        Open PDF ↗
                    </a>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
                {isCompiling ? (
                    <CompilingPreview />
                ) : pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0 bg-white"
                        title="Resume Preview"
                    />
                ) : (
                    <EmptyPreview />
                )}
            </div>
        </div>
    );
}
