import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { PageHeader } from "@/components/page-header";
import AppSidebar from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terraform Misconfiguration Inspector",
  description: "Inspect and fix security threats in your cloud configurations",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let configs: CloudConfig[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/database/getAllConfigData`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch cloud configurations: ${res.statusText}`,
      );
    }
    configs = await res.json();
  } catch (error) {
    console.error("Error fetching configurations:", error);
    configs = [];
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <Suspense fallback={<div>Loading...</div>}>
                <AppSidebar initialConfigs={configs} />
              </Suspense>
              <div className="flex-1 flex flex-col w-full">
                <PageHeader />
                <main className="flex-1 w-full overflow-auto">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import { Suspense } from "react";
