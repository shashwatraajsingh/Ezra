import {
    Clock,
    FileText,
    Sparkles,
    TrendingUp,
} from "lucide-react";

interface StatsRowProps {
    numberOfResumes: number;
    aiCredit: number;
    createdAt: string;
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 flex items-start gap-4">
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 ${accent ?? "bg-white/10"}`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    {label}
                </p>
                <p className="mt-1 text-2xl font-bold text-white">{value}</p>
                {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
            </div>
        </div>
    );
}

export function StatsRow({ numberOfResumes, aiCredit, createdAt }: StatsRowProps) {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                icon={FileText}
                label="Resumes Made"
                value={numberOfResumes}
                sub="All time"
                accent="bg-blue-500/20"
            />
            <StatCard
                icon={Sparkles}
                label="AI Credits"
                value={aiCredit}
                sub="Available"
                accent="bg-yellow-500/20"
            />
            <StatCard
                icon={TrendingUp}
                label="Avg ATS Score"
                value="86%"
                sub="Across all resumes"
                accent="bg-emerald-500/20"
            />
            <StatCard
                icon={Clock}
                label="Member Since"
                value={formatDate(createdAt)}
                accent="bg-purple-500/20"
            />
        </section>
    );
}
