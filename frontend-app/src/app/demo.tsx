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
import { getToken, onAuthChanged } from "@/lib/api/auth"

export function NavBarDemo() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const syncAuth = () => setIsLoggedIn(!!getToken())
        syncAuth()
        return onAuthChanged(syncAuth)
    }, [])

    const navItems = [
        { name: "Home", url: "/", icon: LayoutDashboard },
        { name: "Pricing", url: "/#pricing", icon: FileCode2 },
        { name: "Templates", url: "/templates", icon: LayoutTemplate },
        { name: "AI Assistant", url: "#", icon: Sparkles },
        isLoggedIn
            ? { name: "Dashboard", url: "/dashboard", icon: LayoutGrid }
            : { name: "Get Started", url: "/auth/login", icon: Settings2 },
    ]

    return <NavBar items={navItems} />
}
