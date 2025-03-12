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

// Mock data for cloud configurations
const cloudConfigs: Record<string, CloudConfig> = {
  "aws-prod": {
    id: "aws-prod",
    name: "AWS Production",
    provider: "aws",
    criticalCount: 3,
    highCount: 7,
    pending: false,
  },
  "azure-dev": {
    id: "azure-dev",
    name: "Azure Development",
    provider: "azure",
    criticalCount: 1,
    highCount: 4,
    pending: false,
  },
  "gcp-staging": {
    id: "gcp-staging",
    name: "GCP Staging",
    provider: "gcp",
    criticalCount: 2,
    highCount: 5,
    pending: false,
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

  useEffect(() => {
    if (initialConfigs && initialConfigs.length > 0) {
      const newConfigs = { ...allConfigs };
      initialConfigs.forEach((config) => {
        newConfigs[config.id] = {
          ...config,
          criticalCount: 0,
          highCount: 0,
        };
      });
      setAllConfigs(newConfigs);
    }
  }, []);

  const handleConfigClick = (config: CloudConfig) => {
    if (config.pending) {
      setSelectedConfig(config);
      setIsCredentialsDialogOpen(true);
      return true; // Prevent navigation
    }

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
                      isActive={pathname === `/cloud/${config.id}`}
                      onClick={() =>
                        handleConfigClick(config) ? true : undefined
                      }
                    >
                      <Link href={`/cloud/${config.id}`}>
                        <span>{config.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {config.pending ? (
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
              <SidebarMenuButton asChild isActive={pathname === "/account"}>
                <Link href="/account">
                  <User />
                  <span>Account</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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

      <Button
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Cloud Configuration</span>
      </Button>

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
