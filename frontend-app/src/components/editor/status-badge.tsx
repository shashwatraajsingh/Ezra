import type { ResumeStatus } from "@/lib/types/resume.types";

const STATUS_MAP: Record<ResumeStatus, { label: string; cls: string }> = {
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

export function StatusBadge({ status }: { status: ResumeStatus }) {
    const { label, cls } = STATUS_MAP[status];
    return (
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}
