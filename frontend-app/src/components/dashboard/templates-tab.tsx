import { Brain, Eye, Sparkles, Trash2, Upload } from "lucide-react";

interface TemplateItem {
    id: number;
    title: string;
    uploadedAt: string;
}

interface TemplatesTabProps {
    templates: TemplateItem[];
    onUpload: () => void;
    onDelete: (id: number) => void;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function TemplatesTab({ templates, onUpload, onDelete }: TemplatesTabProps) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Upload card */}
            <button
                onClick={onUpload}
                className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-white/5 backdrop-blur-xl p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[160px] hover:bg-white/10 hover:border-white/30 transition-all"
            >
                <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Upload className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-300">Upload Template</p>
                    <p className="text-xs text-zinc-600 mt-0.5">.tex · .pdf · .docx</p>
                </div>
            </button>

            {templates.map((tpl) => (
                <div
                    key={tpl.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-4"
                >
                    {/* Preview thumbnail */}
                    <div className="h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Brain className="h-8 w-8 text-zinc-700" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-white truncate">{tpl.title}</p>
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
                        <button
                            onClick={() => onDelete(tpl.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
