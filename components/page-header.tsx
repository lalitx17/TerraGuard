"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageHeaderProps {
  defaultTitle?: string
}

export function PageHeader({ defaultTitle = "TerraGuard" }: PageHeaderProps) {
  const [title, setTitle] = useState(defaultTitle)
  const pathname = usePathname()

  // Reset title when navigating away from cloud pages
  useEffect(() => {
    if (!pathname.startsWith("/cloud/")) {
      setTitle(defaultTitle)
    }
  }, [pathname, defaultTitle])

  // Expose a method to update the title
  useEffect(() => {
    // Create a global method to update the title
    window.updatePageTitle = (newTitle: string) => {
      setTitle(newTitle)
    }

    return () => {
      // Clean up
      delete window.updatePageTitle
    }
  }, [])

  return (
    <header className="h-14 border-b flex items-center px-4">
      <div className="flex-1 flex items-center">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
      <UserNav />
    </header>
  )
}

// Add the global method type
declare global {
  interface Window {
    updatePageTitle?: (title: string) => void
  }
}

