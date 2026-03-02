"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassFilter } from "@/components/ui/liquid-glass"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBar({ items, className }: NavBarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div
            className={cn(
                "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-3",
                className,
            )}
        >
            {/* SVG liquid-glass distortion filter — referenced by the glass layers below */}
            <GlassFilter />

            {/*
        Pill container — same layout & gap as before.
        Liquid-glass effect applied via three absolutely-positioned layers
        (identical to GlassEffect in liquid-glass.tsx) + outer box-shadow.
        No layout, animation, or nav-item logic is changed.
      */}
            <div
                className="relative flex items-center gap-3 rounded-full py-1 px-1 overflow-hidden"
                style={{
                    boxShadow: "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)",
                }}
            >
                {/* Layer 1 — backdrop blur + SVG distortion */}
                <div
                    className="absolute inset-0 rounded-full z-0"
                    style={{
                        backdropFilter: "blur(3px)",
                        filter: "url(#glass-distortion)",
                        isolation: "isolate",
                    }}
                />

                {/* Layer 2 — frosted white tint */}
                <div
                    className="absolute inset-0 rounded-full z-10"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                />

                {/* Layer 3 — inner highlight / rim light */}
                <div
                    className="absolute inset-0 rounded-full z-20"
                    style={{
                        boxShadow:
                            "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)",
                    }}
                />

                {/* Nav items — sit above all glass layers (z-30) */}
                <div className="relative z-30 flex items-center gap-3">
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.name

                        return (
                            <Link
                                key={item.name}
                                href={item.url}
                                onClick={() => setActiveTab(item.name)}
                                className={cn(
                                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                                    "text-foreground/80 hover:text-primary",
                                    isActive && "bg-muted text-primary",
                                )}
                            >
                                <span className="hidden md:inline">{item.name}</span>
                                <span className="md:hidden">
                                    <Icon size={18} strokeWidth={2.5} />
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="lamp"
                                        className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                                            <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                                            <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                                            <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                                        </div>
                                    </motion.div>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
