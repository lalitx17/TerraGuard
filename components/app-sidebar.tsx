"use client";

import type React from "react";

import { useState } from "react";
import { Home, Loader2, Plus, Settings } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const cloudConfigs = [
  {
    id: "aws-123",
    name: "Production AWS",
    provider: "aws",
    criticalCount: 2,
    highCount: 4,
    lowCount: 7,
  },
  {
    id: "azure-456",
    name: "Development Azure",
    provider: "azure",
    criticalCount: 0,
    highCount: 1,
    lowCount: 3,
  },
];

export function AppSidebar() {
  const [configs, setConfigs] = useState(cloudConfigs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "aws",
    access_key: "",
    secret_key: "",
    region: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    access_key: false,
    secret_key: false,
    region: false,
  });
  const [extractedConfig, setExtractedConfig] = useState<null | {
    resources: number;
    services: string[];
  }>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {
      name: !formData.name,
      access_key: !formData.access_key,
      secret_key: !formData.secret_key,
      region: !formData.region,
    };

    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setExtractedConfig(null);

    // Simulate API call to extract configuration
    setTimeout(() => {
      // Generate random dummy data
      const extractedData = {
        resources: Math.floor(Math.random() * 100) + 20,
        services: [],
      };

      // Add random services based on provider
      if (formData.provider === "aws") {
        const awsServices = [
          "EC2",
          "S3",
          "RDS",
          "Lambda",
          "CloudFront",
          "IAM",
          "VPC",
        ];
        const numServices = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < numServices; i++) {
          const randomIndex = Math.floor(Math.random() * awsServices.length);
          if (!extractedData.services.includes(awsServices[randomIndex])) {
            extractedData.services.push(awsServices[randomIndex]);
          }
        }
      } else if (formData.provider === "azure") {
        const azureServices = [
          "Virtual Machines",
          "Storage Accounts",
          "App Services",
          "SQL Databases",
          "Cosmos DB",
          "Functions",
        ];
        const numServices = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numServices; i++) {
          const randomIndex = Math.floor(Math.random() * azureServices.length);
          if (!extractedData.services.includes(azureServices[randomIndex])) {
            extractedData.services.push(azureServices[randomIndex]);
          }
        }
      } else {
        const gcpServices = [
          "Compute Engine",
          "Cloud Storage",
          "Cloud SQL",
          "App Engine",
          "BigQuery",
          "Kubernetes Engine",
        ];
        const numServices = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numServices; i++) {
          const randomIndex = Math.floor(Math.random() * gcpServices.length);
          if (!extractedData.services.includes(gcpServices[randomIndex])) {
            extractedData.services.push(gcpServices[randomIndex]);
          }
        }
      }

      setExtractedConfig(extractedData);
      setIsLoading(false);
    }, 3000);
  };

  const addCloudConfig = () => {
    const newConfig = {
      id: `${formData.provider}-${Date.now()}`,
      name: formData.name,
      provider: formData.provider,
      criticalCount: Math.floor(Math.random() * 3),
      highCount: Math.floor(Math.random() * 5) + 2,
      lowCount: Math.floor(Math.random() * 10) + 5,
    };

    setConfigs([...configs, newConfig]);
    setIsAddDialogOpen(false);
    setIsLoading(false);
    setExtractedConfig(null);
    setFormData({
      name: "",
      provider: "aws",
      access_key: "",
      secret_key: "",
      region: "",
    });
    setCurrentTab("basic");
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setIsLoading(false);
    setExtractedConfig(null);
    setFormData({
      name: "",
      provider: "aws",
      access_key: "",
      secret_key: "",
      region: "",
    });
    setFormErrors({
      name: false,
      access_key: false,
      secret_key: false,
      region: false,
    });
    setCurrentTab("basic");
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-2 py-3">
            <span className="text-lg font-semibold">TerraGuard</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
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
                {configs.map((config) => (
                  <SidebarMenuItem key={config.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/cloud/${config.id}`}>
                        <span>{config.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                      {config.criticalCount}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-muted-foreground">
              <p>TerraGuard v1.0.0</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Floating action button for adding cloud configuration */}
      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Cloud Configuration</span>
      </Button>

      <Dialog open={isAddDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Cloud Configuration</DialogTitle>
            <DialogDescription>
              Connect to your cloud provider to scan for misconfigurations.
            </DialogDescription>
          </DialogHeader>

          {!isLoading && !extractedConfig ? (
            <form onSubmit={handleSubmit}>
              <Tabs
                value={currentTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="credentials">Credentials</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Configuration Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Production Environment"
                        className={formErrors.name ? "border-destructive" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-destructive">
                          Configuration name is required
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="provider">Cloud Provider</Label>
                      <Select
                        value={formData.provider}
                        onValueChange={(value) =>
                          handleSelectChange("provider", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">AWS</SelectItem>
                          <SelectItem value="azure">Azure</SelectItem>
                          <SelectItem value="gcp">Google Cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="credentials" className="mt-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="access_key">Access Key / Client ID</Label>
                      <Input
                        id="access_key"
                        name="access_key"
                        value={formData.access_key}
                        onChange={handleInputChange}
                        placeholder="Enter your access key"
                        className={
                          formErrors.access_key ? "border-destructive" : ""
                        }
                      />
                      {formErrors.access_key && (
                        <p className="text-sm text-destructive">
                          Access key is required
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="secret_key">
                        Secret Key / Client Secret
                      </Label>
                      <Input
                        id="secret_key"
                        name="secret_key"
                        type="password"
                        value={formData.secret_key}
                        onChange={handleInputChange}
                        placeholder="Enter your secret key"
                        className={
                          formErrors.secret_key ? "border-destructive" : ""
                        }
                      />
                      {formErrors.secret_key && (
                        <p className="text-sm text-destructive">
                          Secret key is required
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region">Region</Label>
                      <Input
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        placeholder="us-east-1"
                        className={
                          formErrors.region ? "border-destructive" : ""
                        }
                      />
                      {formErrors.region && (
                        <p className="text-sm text-destructive">
                          Region is required
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button type="submit">Extract Configuration</Button>
              </DialogFooter>
            </form>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center font-medium">
                Extracting the configuration...
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                This may take a few moments while we analyze your cloud
                resources.
              </p>
            </div>
          ) : extractedConfig ? (
            <div className="py-4">
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Configuration successfully extracted!
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Discovered Resources</h3>
                  <p className="text-2xl font-bold">
                    {extractedConfig.resources}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Services Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedConfig.services.map((service, index) => (
                      <div
                        key={index}
                        className="bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button onClick={addCloudConfig}>Add Configuration</Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
