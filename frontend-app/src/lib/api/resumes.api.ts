import { authHeaders, jsonHeaders } from "@/lib/api/auth";
import type { ResumeData, ResumeProjectFile } from "@/lib/types/resume.types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function fetchResume(id: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch resume (${res.status})`);
    return res.json();
}

export async function createResume(input: {
    title: string;
    latexSource?: string;
    templateId?: number;
    projectFiles?: ResumeProjectFile[];
}): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`Create failed (${res.status})`);
    return res.json();
}

export async function saveResume(
    id: string,
    latexSource: string,
    extra?: {
        title?: string;
        projectFiles?: ResumeProjectFile[];
    },
): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify({ latexSource, ...extra }),
    });
    if (!res.ok) throw new Error(`Save failed (${res.status})`);
    return res.json();
}

export async function saveFormFields(
    id: string,
    fieldValues: Record<string, string>,
): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify({ fieldValues }),
    });
    if (!res.ok) throw new Error(`Field save failed (${res.status})`);
    return res.json();
}

export async function compileResume(id: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}/compile`, {
        method: "POST",
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error(`Compile failed (${res.status})`);
    return res.json();
}

export async function deleteResume(id: number): Promise<void> {
    await fetch(`${API}/resumes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
}

/**
 * Triggers the authenticated download endpoint and uses the browser's
 * built-in save-as mechanism via a temporary object URL.
 */
export async function downloadResumePdf(
    id: string,
    title: string,
): Promise<void> {
    const res = await fetch(`${API}/resumes/${id}/download`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Download failed (${res.status}): ${await res.text()}`);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export const PDF_BASE_URL = API.replace("/api", "");
