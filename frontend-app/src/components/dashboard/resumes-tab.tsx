import { Download, Eye, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ResumeSummary } from "@/lib/types/resume.types";

interface ResumesTabProps {
    resumes: ResumeSummary[];
    onDelete: (id: number) => void;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
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

function EmptyResumes() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                <FileText className="h-6 w-6 text-zinc-500" />
            </div>
            <div>
                <p className="text-white font-medium">No resumes yet</p>
                <p className="text-sm text-zinc-500 mt-1">Create your first AI-powered resume</p>
            </div>
            <Link
                href="/templates"
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
                <Plus className="h-4 w-4" /> Start from a template
            </Link>
        </div>
    );
}

export function ResumesTab({ resumes, onDelete }: ResumesTabProps) {
    if (resumes.length === 0) return <EmptyResumes />;

    return (
        <div className="space-y-3">
            {resumes.map((resume) => (
                <div
                    key={resume.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5"
                >
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
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${resume.status === "ATS Optimised"
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                    }`}>
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
                            <Link
                                href={`/resumes/${resume.id}`}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                            </Link>
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Download className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(resume.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
