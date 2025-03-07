import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ToastProvider } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terraform Misconfiguration Inspector",
  description: "Inspect and fix security threats in your cloud configurations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col w-full">
                <PageHeader />
                <main className="flex-1 w-full overflow-auto">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </ToastProvider>
      </body>
    </html>
  )
}



import './globals.css'