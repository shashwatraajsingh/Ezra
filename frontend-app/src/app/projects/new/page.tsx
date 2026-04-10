"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    BookOpenText,
    Eye,
    FilePlus2,
    Files,
    FolderOpen,
    LayoutPanelLeft,
    Loader2,
    Play,
    Plus,
    Settings2,
    Sparkles,
} from "lucide-react";

import { getToken } from "@/lib/api/auth";
import {
    PDF_BASE_URL,
    compileResume,
    createResume,
    fetchResume,
    saveResume,
} from "@/lib/api/resumes.api";
import type { ResumeData, ResumeProjectFile } from "@/lib/types/resume.types";

const STORAGE_KEY = "ezra_active_project_resume_id";

const STARTER_FILES: ResumeProjectFile[] = [
    {
        id: "main",
        name: "main.tex",
        language: "latex",
        content: `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}
\\setlist[itemize]{leftmargin=*, itemsep=4pt, topsep=4pt}

\\begin{document}

\\begin{center}
    {\\LARGE Ezra Project} \\\\[4pt]
    shashwat@example.com $\\cdot$ github.com/shashwat
\\end{center}

\\section*{Summary}
Build polished LaTeX documents with a project workspace inspired by Overleaf.

\\section*{Experience}
\\input{sections/experience.tex}

\\section*{References}
See citations in references.bib.

\\end{document}`,
    },
    {
        id: "experience",
        name: "sections/experience.tex",
        language: "latex",
        content: `\\textbf{Frontend Engineer} \\hfill 2025 -- Present \\\\
Built editor workflows, reusable UI systems, and shipping-focused product surfaces.

\\begin{itemize}
    \\item Added structured project editing with reusable document sections.
    \\item Reduced friction between writing, previewing, and iteration.
    \\item Shipped interfaces that feel closer to real creation tools.
\\end{itemize}`,
    },
    {
        id: "references",
        name: "references.bib",
        language: "bib",
        content: `@article{ezra2026,
  title={Designing Better Writing Workspaces},
  author={Ezra Team},
  journal={Internal Notes},
  year={2026}
}`,
    },
    {
        id: "notes",
        name: "notes.md",
        language: "markdown",
        content: `# Writing checklist

- Tighten summary
- Add quantifiable outcomes
- Keep spacing consistent
- Recompile before exporting`,
    },
];

function getFileAccent(language: ResumeProjectFile["language"]) {
    if (language === "latex") return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
    if (language === "bib") return "text-amber-300 border-amber-500/20 bg-amber-500/10";
    return "text-sky-300 border-sky-500/20 bg-sky-500/10";
}

function getLanguageLabel(language: ResumeProjectFile["language"]) {
    if (language === "latex") return "LaTeX";
    if (language === "bib") return "BibTeX";
    return "Markdown";
}

function getMainLatex(files: ResumeProjectFile[]) {
    return files.find((file) => file.name === "main.tex")?.content
        ?? files.find((file) => file.language === "latex")?.content
        ?? "";
}

function EmptyPreview({ isCompiling, compileError }: { isCompiling: boolean; compileError: string | null }) {
    return (
        <div className="flex h-[28rem] items-center justify-center rounded-[28px] border border-white/10 bg-[#f7f7f3] p-8 text-center text-zinc-900 shadow-[0_22px_55px_rgba(0,0,0,0.28)]">
            <div className="max-w-sm space-y-4">
                {isCompiling ? (
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-zinc-400" />
                ) : (
                    <Eye className="mx-auto h-10 w-10 text-zinc-400" />
                )}
                <div>
                    <p className="text-base font-semibold">
                        {isCompiling ? "Compiling PDF preview..." : "No compiled PDF yet"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {compileError
                            ? compileError
                            : "Use Recompile to generate a real PDF preview from your LaTeX project files."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function NewProjectPage() {
    const router = useRouter();
    const [projectName, setProjectName] = useState("Untitled Project");
    const [files, setFiles] = useState<ResumeProjectFile[]>(STARTER_FILES);
    const [activeFileId, setActiveFileId] = useState(STARTER_FILES[0]?.id ?? "");
    const [resume, setResume] = useState<ResumeData | null>(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editorWidth, setEditorWidth] = useState(58);
    const workspaceRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeFile = useMemo(
        () => files.find((file) => file.id === activeFileId) ?? files[0] ?? null,
        [activeFileId, files],
    );

    const pdfUrl = useMemo(() => {
        if (!resume?.compiledPdfPath || resume.status !== "compiled") return null;
        return `${PDF_BASE_URL}${resume.compiledPdfPath}`;
    }, [resume]);

    useEffect(() => {
        if (!getToken()) {
            router.replace("/auth/login");
            return;
        }

        let cancelled = false;

        const boot = async () => {
            try {
                const savedId = sessionStorage.getItem(STORAGE_KEY);

                if (savedId) {
                    const existing = await fetchResume(savedId);
                    if (!cancelled) {
                        setResume(existing);
                        setProjectName(existing.title);
                        setFiles(existing.projectFiles?.length ? existing.projectFiles : STARTER_FILES);
                        setActiveFileId(existing.projectFiles?.[0]?.id ?? STARTER_FILES[0].id);
                        setError(existing.compileError);
                    }
                    return;
                }

                const created = await createResume({
                    title: "Untitled Project",
                    latexSource: getMainLatex(STARTER_FILES),
                    projectFiles: STARTER_FILES,
                });

                sessionStorage.setItem(STORAGE_KEY, String(created.id));

                if (!cancelled) {
                    setResume(created);
                    setError(created.compileError);
                }

                const compiled = await compileResume(String(created.id));
                if (!cancelled) {
                    setResume(compiled);
                    setError(compiled.compileError);
                }
            } catch (err) {
                if (!cancelled) {
                    sessionStorage.removeItem(STORAGE_KEY);
                    setError(err instanceof Error ? err.message : "Unable to open project workspace.");
                }
            } finally {
                if (!cancelled) {
                    setIsBootstrapping(false);
                }
            }
        };

        void boot();

        return () => {
            cancelled = true;
        };
    }, [router]);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            if (!isResizingRef.current || !workspaceRef.current) return;

            const bounds = workspaceRef.current.getBoundingClientRect();
            const relativeX = event.clientX - bounds.left;
            const nextWidth = (relativeX / bounds.width) * 100;
            setEditorWidth(Math.min(78, Math.max(32, nextWidth)));
        };

        const stopResizing = () => {
            isResizingRef.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", stopResizing);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopResizing);
        };
    }, []);

    useEffect(() => () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    }, []);

    const persistProject = async (nextTitle: string, nextFiles: ResumeProjectFile[]) => {
        if (!resume) return;

        setIsSaving(true);
        setError(null);

        try {
            const updated = await saveResume(String(resume.id), getMainLatex(nextFiles), {
                title: nextTitle,
                projectFiles: nextFiles,
            });
            setResume(updated);
            setSaveMessage("Saved");
            window.setTimeout(() => setSaveMessage(null), 1800);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const queueSave = (nextTitle: string, nextFiles: ResumeProjectFile[]) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            void persistProject(nextTitle, nextFiles);
        }, 900);
    };

    const handleContentChange = (nextContent: string) => {
        const nextFiles = files.map((file) =>
            file.id === activeFileId ? { ...file, content: nextContent } : file,
        );
        setFiles(nextFiles);
        queueSave(projectName, nextFiles);
    };

    const handleAddFile = () => {
        const nextIndex = files.length + 1;
        const newFile: ResumeProjectFile = {
            id: `draft-${nextIndex}`,
            name: `draft-${nextIndex}.tex`,
            language: "latex",
            content: `% New file\n\\section*{Draft ${nextIndex}}\nStart writing here.\n`,
        };

        const nextFiles = [...files, newFile];
        setFiles(nextFiles);
        setActiveFileId(newFile.id);
        queueSave(projectName, nextFiles);
    };

    const handleProjectNameChange = (nextTitle: string) => {
        setProjectName(nextTitle);
        queueSave(nextTitle, files);
    };

    const handleCompile = async () => {
        if (!resume) return;

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }

        await persistProject(projectName, files);

        setIsCompiling(true);
        setError(null);
        try {
            const compiled = await compileResume(String(resume.id));
            setResume(compiled);
            setError(compiled.compileError);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Compile failed.");
        } finally {
            setIsCompiling(false);
        }
    };

    const startResizing = () => {
        isResizingRef.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    if (isBootstrapping) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                <div className="space-y-3 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-white/40" />
                    <p className="text-sm text-zinc-500">Preparing project workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden bg-zinc-950 text-white">
            <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,rgba(24,24,27,0.98),rgba(9,9,11,1))]" />

            <div className="relative z-10 flex min-h-screen flex-col">
                <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <Link
                                href="/templates"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Back to templates"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Workspace</p>
                                <input
                                    value={projectName}
                                    onChange={(event) => handleProjectNameChange(event.target.value)}
                                    className="w-full max-w-[16rem] truncate bg-transparent text-lg font-semibold text-white outline-none placeholder:text-zinc-600"
                                    placeholder="Untitled Project"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {saveMessage ? <span className="hidden text-xs text-emerald-400 sm:inline">{saveMessage}</span> : null}
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-zinc-400" /> : null}
                            <button
                                type="button"
                                onClick={handleAddFile}
                                className="flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <FilePlus2 className="h-4 w-4" />
                                <span className="hidden sm:inline">New File</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleCompile()}
                                disabled={isCompiling || !resume}
                                className="flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-60"
                            >
                                {isCompiling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                Recompile
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex flex-1 flex-col xl:flex-row">
                    <aside className="border-b border-white/10 bg-zinc-950/65 backdrop-blur-xl xl:border-b-0 xl:border-r">
                        <div className="space-y-6 p-4 xl:w-[280px]">
                            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                    <FolderOpen className="h-4 w-4 text-emerald-300" />
                                    Project Files
                                </div>
                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                    Keep sections, references, and notes in one workspace. These files are saved and compiled by the backend.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {files.map((file) => {
                                    const isActive = file.id === activeFile?.id;
                                    return (
                                        <button
                                            key={file.id}
                                            type="button"
                                            onClick={() => setActiveFileId(file.id)}
                                            className={`flex min-h-11 w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition-all ${
                                                isActive
                                                    ? "border-white/20 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                                                    : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">{file.name}</p>
                                                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                                                    {getLanguageLabel(file.language)}
                                                </p>
                                            </div>
                                            <span className={`rounded-full border px-2 py-1 text-[10px] ${getFileAccent(file.language)}`}>
                                                {file.language}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                    <Sparkles className="h-4 w-4 text-sky-300" />
                                    Compile Notes
                                </div>
                                <ul className="mt-3 space-y-2 text-xs leading-5 text-zinc-400">
                                    <li>`main.tex` is treated as the project entry point.</li>
                                    <li>Nested paths like `sections/experience.tex` are written before compile.</li>
                                    <li>BibTeX and notes files are preserved in the project workspace.</li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    <div ref={workspaceRef} className="flex min-h-0 flex-1 flex-col xl:flex-row">
                        <section
                            className="flex min-h-0 flex-col border-b border-white/10 bg-zinc-950/40 xl:border-b-0 xl:border-r"
                            style={{ width: `min(100%, ${editorWidth}%)` }}
                        >
                            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
                                {files.map((file) => {
                                    const isActive = file.id === activeFile?.id;
                                    return (
                                        <button
                                            key={file.id}
                                            type="button"
                                            onClick={() => setActiveFileId(file.id)}
                                            className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-all ${
                                                isActive
                                                    ? "border-emerald-400/25 bg-emerald-500/10 text-white"
                                                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            <Files className="h-4 w-4" />
                                            {file.name}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <LayoutPanelLeft className="h-4 w-4" />
                                    <span>Editor</span>
                                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
                                        {activeFile ? getLanguageLabel(activeFile.language) : "No file"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span>{activeFile?.content.split("\n").length ?? 0} lines</span>
                                    <span>{activeFile?.content.length ?? 0} chars</span>
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 p-4">
                                <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d10] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-white">{activeFile?.name}</p>
                                            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                                                {activeFile ? getLanguageLabel(activeFile.language) : "Select a file"}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddFile}
                                            className="flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add file
                                        </button>
                                    </div>

                                    <textarea
                                        value={activeFile?.content ?? ""}
                                        onChange={(event) => handleContentChange(event.target.value)}
                                        spellCheck={false}
                                        className="min-h-0 flex-1 resize-none bg-transparent px-5 py-4 font-mono text-[13px] leading-7 text-zinc-200 outline-none placeholder:text-zinc-600"
                                        placeholder="Start writing your document here..."
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="hidden items-stretch bg-zinc-950/70 xl:flex">
                            <button
                                type="button"
                                onPointerDown={startResizing}
                                aria-label="Resize editor and preview panels"
                                className="group flex w-4 cursor-col-resize items-center justify-center"
                            >
                                <span className="h-20 w-1 rounded-full bg-white/10 transition-colors group-hover:bg-emerald-400/60" />
                            </button>
                        </div>

                        <aside className="flex min-h-0 flex-1 flex-col bg-zinc-950/70 backdrop-blur-xl">
                            <div className="border-b border-white/10 px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-sky-300" />
                                        <h2 className="text-sm font-semibold text-white">Compiled PDF</h2>
                                    </div>
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400">
                                        {Math.round(100 - editorWidth)}% width
                                    </span>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                    Drag the divider between editor and preview to resize both panels.
                                </p>
                                {resume ? (
                                    <p className="mt-2 text-[11px] text-zinc-600">
                                        Resume #{resume.id} · {resume.status}
                                    </p>
                                ) : null}
                            </div>

                            <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
                                {error ? (
                                    <div className="flex items-start gap-3 rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
                                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <div className="leading-6">{error}</div>
                                    </div>
                                ) : null}

                                {pdfUrl ? (
                                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_22px_55px_rgba(0,0,0,0.28)]">
                                        <iframe
                                            src={pdfUrl}
                                            title="Compiled PDF preview"
                                            className="h-[48rem] w-full border-0 bg-white"
                                        />
                                    </div>
                                ) : (
                                    <EmptyPreview isCompiling={isCompiling} compileError={resume?.compileError ?? null} />
                                )}

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <BookOpenText className="h-4 w-4 text-emerald-300" />
                                            Project Snapshot
                                        </div>
                                        <div className="mt-4 space-y-3 text-sm text-zinc-400">
                                            <div className="flex items-center justify-between">
                                                <span>Files</span>
                                                <span className="text-white">{files.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Open doc</span>
                                                <span className="max-w-[10rem] truncate text-white">{activeFile?.name ?? "-"}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Project title</span>
                                                <span className="max-w-[10rem] truncate text-white">{projectName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                                            <Settings2 className="h-4 w-4 text-sky-300" />
                                            Backend Compile
                                        </div>
                                        <p className="mt-3 text-xs leading-5 text-zinc-300">
                                            The backend now writes your full project file tree to a temp directory and runs `pdflatex` against the main LaTeX entry file.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}
