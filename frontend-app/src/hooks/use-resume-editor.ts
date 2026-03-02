"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    fetchResume,
    saveResume,
    compileResume,
} from "@/lib/api/resumes.api";
import { getToken } from "@/lib/api/auth";
import type { ResumeData, ViewMode } from "@/lib/types/resume.types";

interface UseResumeEditorReturn {
    resume: ResumeData | null;
    latex: string;
    isDirty: boolean;
    isSaving: boolean;
    isCompiling: boolean;
    viewMode: ViewMode;
    error: string | null;
    saveMsg: string | null;
    setLatex: (val: string) => void;
    setViewMode: (mode: ViewMode) => void;
    handleSave: (src?: string) => Promise<void>;
    handleCompile: () => Promise<void>;
    dismissError: () => void;
}

export function useResumeEditor(id: string): UseResumeEditorReturn {
    const router = useRouter();

    const [resume, setResume] = useState<ResumeData | null>(null);
    const [latex, setLatexState] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("split");
    const [error, setError] = useState<string | null>(null);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latexRef = useRef(latex);
    latexRef.current = latex;

    // Guard + initial fetch
    useEffect(() => {
        if (!getToken()) { router.replace("/auth/login"); return; }
        fetchResume(id)
            .then((r) => { setResume(r); setLatexState(r.latexSource ?? ""); })
            .catch((e) => setError(String(e)));
    }, [id, router]);

    // Auto-save 3 s after last keystroke
    const setLatex = useCallback((val: string) => {
        setLatexState(val);
        setIsDirty(true);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            handleSave(val);
        }, 3000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSave = useCallback(async (src?: string) => {
        const source = src ?? latexRef.current;
        setIsSaving(true);
        try {
            const updated = await saveResume(id, source);
            setResume(updated);
            setIsDirty(false);
            setSaveMsg("Saved");
            setTimeout(() => setSaveMsg(null), 2000);
        } catch (e) {
            setError(String(e));
        } finally {
            setIsSaving(false);
        }
    }, [id]);

    const handleCompile = useCallback(async () => {
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

    const dismissError = useCallback(() => setError(null), []);

    return {
        resume,
        latex,
        isDirty,
        isSaving,
        isCompiling,
        viewMode,
        error,
        saveMsg,
        setLatex,
        setViewMode,
        handleSave,
        handleCompile,
        dismissError,
    };
}
