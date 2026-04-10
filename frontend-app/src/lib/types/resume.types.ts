export type ResumeStatus = "draft" | "compiled" | "error";
export type ViewMode = "form" | "editor" | "split" | "preview";

export interface ResumeProjectFile {
    id: string;
    name: string;
    language: "latex" | "bib" | "markdown";
    content: string;
}

export interface ResumeData {
    id: number;
    title: string;
    latexSource: string | null;
    fieldValues: Record<string, string> | null;
    projectFiles: ResumeProjectFile[] | null;
    compiledPdfPath: string | null;
    atsScore: number;
    status: ResumeStatus;
    compileError: string | null;
    updatedAt: string;
}

export interface ResumeSummary {
    id: number;
    title: string;
    updatedAt: string;
    atsScore: number;
    status: "ATS Optimised" | "Needs Review";
}
