import { useRef } from "react";
import { Code2 } from "lucide-react";

interface LatexEditorPaneProps {
    value: string;
    onChange: (val: string) => void;
}

export function LatexEditorPane({ value, onChange }: LatexEditorPaneProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            {/* Pane header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400">LaTeX Source</span>
                </div>
                <span className="text-[10px] text-zinc-600">
                    {value.split("\n").length} lines
                </span>
            </div>

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                className="flex-1 resize-none bg-transparent text-sm text-zinc-200 font-mono p-4 focus:outline-none placeholder-zinc-700 leading-relaxed"
                placeholder="% Start writing LaTeX here…"
                style={{ tabSize: 2 }}
            />
        </div>
    );
}
