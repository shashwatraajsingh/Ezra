export type ResumeStatus = "draft" | "compiled" | "error";
export type ViewMode = "split" | "editor" | "preview";

export interface ResumeData {
    id: number;
    title: string;
    latexSource: string | null;
    compiledPdfPath: string | null;
    atsScore: number;
    status: ResumeStatus;
    compileError: string | null;
    updatedAt: string;
}

/** Shape of each resume in the dashboard list */
export interface ResumeSummary {
    id: number;
    title: string;
    updatedAt: string;
    atsScore: number;
    status: "ATS Optimised" | "Needs Review";
}
