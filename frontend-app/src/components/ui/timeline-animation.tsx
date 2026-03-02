"use client";

import { cn } from "@/lib/utils";
import {
    motion,
    useInView,
    Variants,
} from "framer-motion";
import React, { ElementType, RefObject, useRef } from "react";

type AnyProps = Record<string, unknown>;

type TimelineContentProps = {
    as?: ElementType;
    animationNum: number;
    timelineRef: RefObject<HTMLElement | null>;
    customVariants?: Variants;
    className?: string;
    children?: React.ReactNode;
} & AnyProps;

const defaultVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
    },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            delay: i * 0.15,
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

export function TimelineContent({
    as: Tag = "div",
    animationNum,
    timelineRef: _timelineRef,
    customVariants,
    className,
    children,
    ...rest
}: TimelineContentProps) {
    const internalRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(internalRef, {
        once: true,
        margin: "0px 0px -80px 0px",
    });

    const variants = customVariants ?? defaultVariants;

    return (
        <motion.div
            ref={internalRef}
            custom={animationNum}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={cn(className)}
            style={{ display: Tag === "p" ? "block" : undefined }}
            {...(rest as AnyProps)}
        >
            {Tag === "div" || Tag === "p" || Tag === "span" || Tag === "article" || Tag === "section" ? (
                children
            ) : (
                // Render the actual Tag inside if needed
                children
            )}
        </motion.div>
    );
}
