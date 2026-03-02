import { authHeaders, jsonHeaders } from "@/lib/api/auth";
import type { ResumeData } from "@/lib/types/resume.types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function fetchResume(id: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch resume: ${res.statusText}`);
    return res.json();
}

export async function saveResume(id: string, latexSource: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify({ latexSource }),
    });
    if (!res.ok) throw new Error(`Save failed: ${res.statusText}`);
    return res.json();
}

export async function compileResume(id: string): Promise<ResumeData> {
    const res = await fetch(`${API}/resumes/${id}/compile`, {
        method: "POST",
        headers: jsonHeaders(),
    });
    if (!res.ok) throw new Error(`Compile failed: ${res.statusText}`);
    return res.json();
}

export async function deleteResume(id: number): Promise<void> {
    await fetch(`${API}/resumes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
}

/** Base URL for accessing compiled PDFs served as static files */
export const PDF_BASE_URL = API.replace("/api", "");
