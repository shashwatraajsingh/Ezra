"use client"

import {
    LayoutDashboard,
    FileCode2,
    LayoutTemplate,
    Sparkles,
    Settings2,
    LayoutGrid,
} from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { useEffect, useState } from "react"

export function NavBarDemo() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // Check for JWT token stored after login
        const token =
            localStorage.getItem("access_token") ||
            localStorage.getItem("token") ||
            localStorage.getItem("jwt")
        setIsLoggedIn(!!token)

        // Re-check on storage events (e.g., login in another tab)
        const handleStorage = () => {
            const t =
                localStorage.getItem("access_token") ||
                localStorage.getItem("token") ||
                localStorage.getItem("jwt")
            setIsLoggedIn(!!t)
        }
        window.addEventListener("storage", handleStorage)
        return () => window.removeEventListener("storage", handleStorage)
    }, [])

    const navItems = [
        { name: "Home", url: "/", icon: LayoutDashboard },
        { name: "Pricing", url: "/#pricing", icon: FileCode2 },
        { name: "Templates", url: "/templates", icon: LayoutTemplate },
        { name: "AI Assistant", url: "#", icon: Sparkles },
        isLoggedIn
            ? { name: "Dashboard", url: "/dashboard", icon: LayoutGrid }
            : { name: "Get Started", url: "/auth/signup", icon: Settings2 },
    ]

    return <NavBar items={navItems} />
}
