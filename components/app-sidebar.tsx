"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { AddCloudConfigDialog } from "./add-cloud-config-dialog";
import { AddCredentialsDialog } from "./add-credentials-dialog";
import { CloudConfig, SecurityIssue, AppSidebarProps } from "@/types/config";

// Mock data for cloud configurations
const cloudConfigs: Record<string, CloudConfig> = {
  "aws-prod": {
    id: "aws-prod",
    name: "AWS Production",
    provider: "aws",
    criticalCount: 3,
    highCount: 7,
    lowCount: 12,
    resources: 124,
    SecurePercentage: 82,
    createdAt: new Date("2025-03-13T18:51:00Z"),
    updatedAt: new Date("2025-03-13T18:51:00Z"),
    issues: [],
    isPending: false,
  },
  "azure-dev": {
    id: "azure-dev",
    name: "Azure Development",
    provider: "azure",
    criticalCount: 1,
    highCount: 4,
    lowCount: 8,
    resources: 78,
    SecurePercentage: 89,
    createdAt: new Date("2025-03-13T18:51:00Z"),
    updatedAt: new Date("2025-03-13T18:51:00Z"),
    issues: [],
    isPending: false,
  },
  "gcp-staging": {
    id: "gcp-staging",
    name: "GCP Staging",
    provider: "gcp",
    criticalCount: 2,
    highCount: 5,
    lowCount: 9,
    resources: 98,
    SecurePercentage: 85,
    createdAt: new Date("2025-03-13T18:51:00Z"),
    updatedAt: new Date("2025-03-13T18:51:00Z"),
    issues: [],
    isPending: false,
  },
};

export default function AppSidebar({ initialConfigs }: AppSidebarProps) {
  const pathname = usePathname();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<CloudConfig | null>(
    null,
  );
  const [allConfigs, setAllConfigs] = useState<Record<string, CloudConfig>>({
    ...cloudConfigs,
  });

  const isEditorPage = pathname?.includes("/editor");

  useEffect(() => {
    if (initialConfigs && initialConfigs.length > 0) {
      const newConfigs = { ...allConfigs };
      initialConfigs.forEach((config) => {
        newConfigs[config.id] = {
          ...config,
        };
      });
      setAllConfigs(newConfigs);
    }
  }, [initialConfigs]);

  const handleConfigClick = (config: CloudConfig) => {
    return false; // Allow navigation
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center px-2 py-2">
            <span className="text-xl font-bold">TerraGuard</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Cloud Configurations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Object.values(allConfigs).map((config) => (
                  <SidebarMenuItem key={config.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === `/cloud/${config.id}` ||
                        pathname === `/cloud/${config.id}/editor`
                      }
                      onClick={() =>
                        handleConfigClick(config) ? true : undefined
                      }
                    >
                      <Link href={`/cloud/${config.id}`}>
                        <span>{config.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {config.isPending ? (
                      <SidebarMenuBadge className="bg-yellow-500 text-white">
                        Pending
                      </SidebarMenuBadge>
                    ) : (config.criticalCount ?? 0) > 0 ? (
                      <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                        {config.criticalCount}
                      </SidebarMenuBadge>
                    ) : (config.highCount ?? 0) > 0 ? (
                      <SidebarMenuBadge className="bg-orange-500 text-white">
                        {config.highCount}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {!isEditorPage && (
        <Button
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Cloud Configuration</span>
        </Button>
      )}

      <AddCloudConfigDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <AddCredentialsDialog
        open={isCredentialsDialogOpen}
        onOpenChange={setIsCredentialsDialogOpen}
        config={selectedConfig}
      />
    </>
  );
}
