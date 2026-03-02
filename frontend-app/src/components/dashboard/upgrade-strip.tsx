import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function UpgradeStrip() {
    return (
        <section>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10">
                            <Sparkles className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Upgrade to Business</p>
                            <p className="text-xs text-zinc-500">
                                Unlock unlimited resumes & advanced AI features
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/#pricing"
                        className="shrink-0 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all"
                    >
                        View Plans <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
