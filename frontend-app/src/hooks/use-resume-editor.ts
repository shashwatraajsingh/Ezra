"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    compileResume,
    downloadResumePdf,
    fetchResume,
    saveFormFields,
    saveResume,
} from "@/lib/api/resumes.api";
import { getToken } from "@/lib/api/auth";
import type { ResumeData, ViewMode } from "@/lib/types/resume.types";

interface UseResumeEditorReturn {
    resume: ResumeData | null;
    latex: string;
    fieldValues: Record<string, string>;
    isDirty: boolean;
    isSaving: boolean;
    isCompiling: boolean;
    isDownloading: boolean;
    viewMode: ViewMode;
    error: string | null;
    saveMsg: string | null;
    setLatex: (val: string) => void;
    setViewMode: (mode: ViewMode) => void;
    handleSave: (src?: string) => Promise<void>;
    handleFormSave: (fields: Record<string, string>) => Promise<void>;
    handleCompile: () => Promise<void>;
    handleDownload: () => Promise<void>;
    dismissError: () => void;
}

export function useResumeEditor(id: string): UseResumeEditorReturn {
    const router = useRouter();

    const [resume, setResume] = useState<ResumeData | null>(null);
    const [latex, setLatexState] = useState("");
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("split");
    const [error, setError] = useState<string | null>(null);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);

    // Keep a ref to latest latex so the debounced save closure always reads
    // the most recent value without stale closure issues.
    const latexRef = useRef(latex);
    latexRef.current = latex;

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Auth guard + initial fetch ────────────────────────────────────────────
    useEffect(() => {
        if (!getToken()) { router.replace("/auth/login"); return; }
        fetchResume(id)
            .then((r) => {
                setResume(r);
                setLatexState(r.latexSource ?? "");
                setFieldValues(r.fieldValues ?? {});
            })
            .catch((e) => setError(String(e)));
    }, [id, router]);

    // ── Flash message helper ──────────────────────────────────────────────────
    const flashSaved = useCallback(() => {
        setSaveMsg("Saved");
        setTimeout(() => setSaveMsg(null), 2000);
    }, []);

    // ── LaTeX editor: auto-save after 3 s of inactivity ──────────────────────
    const setLatex = useCallback(
        (val: string) => {
            setLatexState(val);
            setIsDirty(true);
            if (saveTimer.current) clearTimeout(saveTimer.current);
            saveTimer.current = setTimeout(() => handleSave(val), 3000);
        },
        // handleSave is stable thanks to useCallback([id]) below
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id],
    );

    // ── Manual / debounced latex save ─────────────────────────────────────────
    const handleSave = useCallback(
        async (src?: string) => {
            const source = src ?? latexRef.current;
            setIsSaving(true);
            try {
                const updated = await saveResume(id, source);
                setResume(updated);
                setIsDirty(false);
                flashSaved();
            } catch (e) {
                setError(String(e));
            } finally {
                setIsSaving(false);
            }
        },
        [id, flashSaved],
    );

    // ── Form field save ───────────────────────────────────────────────────────
    const handleFormSave = useCallback(
        async (fields: Record<string, string>) => {
            setIsSaving(true);
            try {
                const updated = await saveFormFields(id, fields);
                setResume(updated);
                setFieldValues(updated.fieldValues ?? fields);
                flashSaved();
            } catch (e) {
                setError(String(e));
            } finally {
                setIsSaving(false);
            }
        },
        [id, flashSaved],
    );

    // ── Compile ───────────────────────────────────────────────────────────────
    const handleCompile = useCallback(async () => {
        // Flush any pending auto-save first
        if (saveTimer.current) clearTimeout(saveTimer.current);
        await handleSave();

        setIsCompiling(true);
        setError(null);
        try {
            const updated = await compileResume(id);
            setResume(updated);
            if (updated.status === "error") {
                setError(updated.compileError ?? "Compile failed");
            }
        } catch (e) {
            setError(String(e));
        } finally {
            setIsCompiling(false);
        }
    }, [id, handleSave]);

    // ── Download ──────────────────────────────────────────────────────────────
    const handleDownload = useCallback(async () => {
        if (!resume) return;
        setIsDownloading(true);
        try {
            await downloadResumePdf(id, resume.title);
        } catch (e) {
            setError(String(e));
        } finally {
            setIsDownloading(false);
        }
    }, [id, resume]);

    const dismissError = useCallback(() => setError(null), []);

    return {
        resume,
        latex,
        fieldValues,
        isDirty,
        isSaving,
        isCompiling,
        isDownloading,
        viewMode,
        error,
        saveMsg,
        setLatex,
        setViewMode,
        handleSave,
        handleFormSave,
        handleCompile,
        handleDownload,
        dismissError,
    };
}
