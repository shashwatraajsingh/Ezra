import { BookOpen, GraduationCap, Mail, Star, User } from "lucide-react";
import type { StudentData } from "@/lib/types/student.types";

interface ProfileDetailsCardProps {
    student: StudentData;
}

export function ProfileDetailsCard({ student }: ProfileDetailsCardProps) {
    const fields: {
        icon: React.ElementType;
        label: string;
        value: string;
        isBadge?: boolean;
    }[] = [
            { icon: Mail, label: "Email", value: student.email },
            { icon: BookOpen, label: "Branch", value: student.branch },
            { icon: GraduationCap, label: "College", value: student.college },
            { icon: Star, label: "Plan", value: "Starter", isBadge: true },
        ];

    return (
        <section>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6">
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-5 flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile Details
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {fields.map(({ icon: Icon, label, value, isBadge }) => (
                        <div key={label} className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                                <Icon className="h-4 w-4 text-zinc-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-white truncate">{value}</p>
                                    {isBadge && (
                                        <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
