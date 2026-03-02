import { AlertTriangle } from "lucide-react";

interface CompileErrorBannerProps {
    error: string;
    onDismiss: () => void;
}

export function CompileErrorBanner({ error, onDismiss }: CompileErrorBannerProps) {
    return (
        <div className="relative z-20 flex items-start gap-3 px-4 py-3 bg-rose-950/60 border-b border-rose-500/30 shrink-0">
            <AlertTriangle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-400">Compile Error</p>
                <pre className="text-[11px] text-rose-300/80 mt-1 overflow-x-auto whitespace-pre-wrap max-h-24">
                    {error}
                </pre>
            </div>
            <button
                onClick={onDismiss}
                className="text-rose-400 hover:text-white text-xs shrink-0"
            >
                Dismiss
            </button>
        </div>
    );
}
