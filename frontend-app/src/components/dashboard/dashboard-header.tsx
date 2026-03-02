import { LogOut, Sparkles, Target } from "lucide-react";

interface DashboardHeaderProps {
    aiCredit: number;
    onLogout: () => void;
}

export function DashboardHeader({ aiCredit, onLogout }: DashboardHeaderProps) {
    return (
        <header className="relative z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                        <Target className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-white tracking-tight">Ezra</span>
                    <span className="hidden sm:block h-4 w-px bg-white/10" />
                    <span className="hidden sm:block text-sm text-zinc-500">Dashboard</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-xs font-medium text-zinc-300">
                            {aiCredit} AI Credits
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
