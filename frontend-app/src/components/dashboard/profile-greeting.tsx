import { ChevronRight, LogOut, Plus, Sparkles } from "lucide-react";

interface ProfileGreetingProps {
    name: string;
    email: string;
    aiCredit: number;
    onNewResume: () => void;
    onLogout: () => void;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function ProfileGreeting({
    name,
    email,
    aiCredit,
    onNewResume,
    onLogout,
}: ProfileGreetingProps) {
    return (
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Avatar + identity */}
            <div className="flex items-center gap-5">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/20 to-white/5 text-xl font-bold text-white shadow-xl backdrop-blur-sm">
                    {getInitials(name)}
                    <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-1">
                        Welcome back
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                        {name}
                    </h1>
                    <p className="text-sm text-zinc-400">{email}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* AI credit pill */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-xs font-medium text-zinc-300">{aiCredit} AI Credits</span>
                </div>

                {/* New resume */}
                <button
                    onClick={onNewResume}
                    className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    New Resume
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </div>
        </section>
    );
}
