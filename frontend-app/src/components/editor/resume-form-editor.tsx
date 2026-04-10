"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Save, LayoutList } from "lucide-react";

// ─── Field metadata ────────────────────────────────────────────────────────
// Human-readable labels and groupings for known placeholder keys.
// Unknown keys (from user-uploaded templates) get an auto-generated label.

interface FieldMeta {
    label: string;
    placeholder?: string;
    multiline?: boolean;
    group: string;
}

const FIELD_META: Record<string, FieldMeta> = {
    // Contact
    name: { label: "Full Name", placeholder: "Jane Doe", group: "Contact" },
    phone: { label: "Phone", placeholder: "+1 (555) 000-0000", group: "Contact" },
    email: { label: "Email", placeholder: "jane@example.com", group: "Contact" },
    linkedin: { label: "LinkedIn handle", placeholder: "janedoe", group: "Contact" },
    github: { label: "GitHub handle", placeholder: "janedoe", group: "Contact" },
    // Education
    university: { label: "University name", placeholder: "MIT", group: "Education" },
    university_location: { label: "University location", placeholder: "Cambridge, MA", group: "Education" },
    degree: { label: "Degree & major", placeholder: "B.Tech in Computer Science", group: "Education" },
    graduation_year: { label: "Years attended", placeholder: "2022 -- 2026", group: "Education" },
    school: { label: "School / Jr. College", placeholder: "Springfield High School", group: "Education" },
    school_location: { label: "School location", placeholder: "Springfield, IL", group: "Education" },
    school_qualification: { label: "Qualification", placeholder: "Higher Secondary (CBSE) — 95.4\\%", group: "Education" },
    school_year: { label: "School year", placeholder: "2022", group: "Education" },
    // Experience
    job1_title: { label: "Job title", placeholder: "Software Engineering Intern", group: "Experience" },
    job1_dates: { label: "Duration", placeholder: "June 2025 -- Aug. 2025", group: "Experience" },
    job1_company: { label: "Company", placeholder: "Acme Corp.", group: "Experience" },
    job1_location: { label: "Location", placeholder: "Remote", group: "Experience" },
    job1_point1: { label: "Bullet 1", multiline: true, placeholder: "Built X that achieved Y by doing Z.", group: "Experience" },
    job1_point2: { label: "Bullet 2", multiline: true, placeholder: "Reduced latency by 40\\% via...", group: "Experience" },
    job1_point3: { label: "Bullet 3", multiline: true, placeholder: "Led migration of...", group: "Experience" },
    // Projects
    project1_name: { label: "Project 1 name", placeholder: "Ezra", group: "Projects" },
    project1_tech: { label: "Tech stack", placeholder: "Next.js, NestJS, MySQL", group: "Projects" },
    project1_dates: { label: "Dates", placeholder: "Jan. 2026 -- Present", group: "Projects" },
    project1_point1: { label: "Description 1", multiline: true, placeholder: "Built...", group: "Projects" },
    project1_point2: { label: "Description 2", multiline: true, placeholder: "Reduced...", group: "Projects" },
    project2_name: { label: "Project 2 name", placeholder: "YoCrawl", group: "Projects" },
    project2_tech: { label: "Tech stack", placeholder: "Node.js, Playwright, Redis", group: "Projects" },
    project2_dates: { label: "Dates", placeholder: "Aug. 2025 -- Nov. 2025", group: "Projects" },
    project2_point1: { label: "Description 1", multiline: true, placeholder: "Built...", group: "Projects" },
    project2_point2: { label: "Description 2", multiline: true, placeholder: "Reduced...", group: "Projects" },
    // Skills
    languages: { label: "Languages", placeholder: "TypeScript, Python, Java, C++", group: "Skills" },
    frameworks: { label: "Frameworks", placeholder: "NestJS, Next.js, Express, React", group: "Skills" },
    databases: { label: "Databases", placeholder: "MySQL, PostgreSQL, MongoDB, Redis", group: "Skills" },
    tools: { label: "Tools", placeholder: "Git, Docker, AWS, Linux, Nginx", group: "Skills" },
};

function humanise(key: string): FieldMeta {
    return (
        FIELD_META[key] ?? {
            label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            group: "Other",
        }
    );
}

/** Extract {{key}} tokens from a LaTeX string in insertion order, deduplicated. */
function extractPlaceholders(latex: string): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const match of latex.matchAll(/\{\{([^}]+)\}\}/g)) {
        const key = match[1];
        if (!seen.has(key)) { seen.add(key); out.push(key); }
    }
    return out;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ResumeFormEditorProps {
    latex: string;
    initialValues: Record<string, string>;
    isSaving: boolean;
    onSave: (fields: Record<string, string>) => void;
}

export function ResumeFormEditor({
    latex,
    initialValues,
    isSaving,
    onSave,
}: ResumeFormEditorProps) {
    const fields = useMemo(() => extractPlaceholders(latex), [latex]);

    const [values, setValues] = useState<Record<string, string>>(initialValues);

    // Sync external initialValues (e.g. after first load)
    useEffect(() => {
        setValues((prev) => ({ ...initialValues, ...prev }));
    }, [initialValues]);

    const handleChange = (key: string, val: string) =>
        setValues((prev) => ({ ...prev, [key]: val }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(values);
    };

    // Group fields by their category
    const groups = useMemo(() => {
        const map = new Map<string, string[]>();
        for (const key of fields) {
            const { group } = humanise(key);
            if (!map.has(group)) map.set(group, []);
            map.get(group)!.push(key);
        }
        return map;
    }, [fields]);

    if (fields.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
                <LayoutList className="h-10 w-10 text-zinc-700" />
                <div>
                    <p className="text-zinc-400 font-medium text-sm">No editable fields detected</p>
                    <p className="text-zinc-600 text-xs mt-1">
                        Add{" "}
                        <code className="text-zinc-400 font-mono">{`{{fieldName}}`}</code>{" "}
                        placeholders to your LaTeX and they will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                    <LayoutList className="h-4 w-4 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400">Form Editor</span>
                </div>
                <span className="text-[10px] text-zinc-600">{fields.length} fields</span>
            </div>

            {/* Scrollable fields */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {[...groups.entries()].map(([group, keys]) => (
                    <fieldset key={group} className="space-y-3">
                        <legend className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 pb-1 border-b border-white/10 w-full">
                            {group}
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {keys.map((key) => {
                                const meta = humanise(key);
                                return (
                                    <div
                                        key={key}
                                        className={meta.multiline ? "md:col-span-2" : ""}
                                    >
                                        <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                                            {meta.label}
                                            <span className="ml-1 font-mono text-zinc-700 text-[10px]">
                                                {`{{${key}}}`}
                                            </span>
                                        </label>
                                        {meta.multiline ? (
                                            <textarea
                                                rows={2}
                                                value={values[key] ?? ""}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                                placeholder={meta.placeholder}
                                                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 leading-relaxed font-mono"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={values[key] ?? ""}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                                placeholder={meta.placeholder}
                                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>
                ))}
            </div>

            {/* Sticky save footer */}
            <div className="shrink-0 px-5 py-3 border-t border-white/10 bg-zinc-950/60 backdrop-blur-sm">
                <p className="text-[10px] text-zinc-600 mb-2">
                    Values are merged into the LaTeX at compile time — the template structure is never overwritten.
                </p>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 active:scale-[.99] transition-all disabled:opacity-60"
                >
                    {isSaving
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Save className="h-4 w-4" />}
                    {isSaving ? "Saving…" : "Save & Recompile"}
                </button>
            </div>
        </form>
    );
}
