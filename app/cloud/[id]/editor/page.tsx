"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Code,
  GitBranchPlus,
  GitCommit,
  GitPullRequest,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/code-editor";
import { useToast } from "@/hooks/use-toast";
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
import { useParams } from "next/navigation";

// Sample configuration files for different providers
const sampleConfigs = {
  aws: {
    "main.tf": `provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "example" {
  bucket = "my-terraform-bucket"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
  }
}`,
    "variables.tf": `variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}`,
    "outputs.tf": `output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}`,
  },
  azure: {
    "main.tf": `provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "example" {
  name     = "example-resources"
  location = "West Europe"
}

resource "azurerm_virtual_network" "example" {
  name                = "example-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}`,
    "variables.tf": `variable "location" {
  description = "Azure region"
  type        = string
  default     = "West Europe"
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
  default     = "example-resources"
}`,
  },
  gcp: {
    "main.tf": `provider "google" {
  project = "my-project-id"
  region  = "us-central1"
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    network = google_compute_network.vpc_network.name
    access_config {
    }
  }
}`,
    "variables.tf": `variable "project" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}`,
  },
};

export default function EditorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [configFiles, setConfigFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>("");
  const [configName, setConfigName] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [branch, setBranch] = useState("main");
  const [isPushing, setIsPushing] = useState(false);
  const params = useParams();

  useEffect(() => {
    // In a real app, you would fetch the actual configuration files from an API
    // For now, we'll use sample configurations based on the provider
    const configId = params.id;

    // Extract provider from ID (e.g., "aws-123" -> "aws")
    const providerFromId = configId.split("-")[0];

    if (
      providerFromId &&
      sampleConfigs[providerFromId as keyof typeof sampleConfigs]
    ) {
      setProvider(providerFromId);
      setConfigFiles(
        sampleConfigs[providerFromId as keyof typeof sampleConfigs],
      );
      setActiveFile(
        Object.keys(
          sampleConfigs[providerFromId as keyof typeof sampleConfigs],
        )[0],
      );

      // Set config name for the header
      const configNames: Record<string, string> = {
        "aws-prod": "AWS Production",
        "azure-dev": "Azure Development",
        "gcp-staging": "GCP Staging",
        "aws-123": "Production AWS",
        "azure-456": "Development Azure",
      };

      setConfigName(
        configNames[configId] ||
          `${providerFromId.toUpperCase()} Configuration`,
      );

      // Update page title
      if (window.updatePageTitle) {
        window.updatePageTitle(
          `${configNames[configId] || `${providerFromId.toUpperCase()} Configuration`} - Editor`,
        );
      }
    }
  }, [params.id]);

  const handleSaveFile = (content: string) => {
    if (activeFile) {
      setConfigFiles((prev) => ({
        ...prev,
        [activeFile]: content,
      }));

      // In a real app, you would send this to your API
      toast({
        title: "File saved",
        description: `${activeFile} has been saved successfully.`,
      });
    }
  };

  const handleSaveAll = () => {
    // In a real app, you would save all files to your API
    toast({
      title: "All files saved",
      description: "All configuration files have been saved successfully.",
    });
  };

  const handlePushChanges = () => {
    setIsPushDialogOpen(true);
  };

  const submitPushChanges = () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commit message",
        variant: "destructive",
      });
      return;
    }

    setIsPushing(true);

    // Simulate pushing changes
    setTimeout(() => {
      setIsPushing(false);
      setIsPushDialogOpen(false);
      setCommitMessage("");

      toast({
        title: "Changes pushed",
        description: `Changes have been pushed to ${branch} branch.`,
      });
    }, 2000);
  };

  if (!activeFile || Object.keys(configFiles).length === 0) {
    return (
      <div className="w-full py-6">
        <Container>
          <div className="p-8">Loading configuration files...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="border-b">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/cloud/${params.id}`)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">{configName} - Editor</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveAll}>
                <Save className="mr-2 h-4 w-4" />
                Save All
              </Button>
              <Button onClick={handlePushChanges}>
                <GitCommit className="mr-2 h-4 w-4" />
                Push Changes
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <div className="flex-1 overflow-hidden">
        <Container className="h-full py-0">
          <div className="flex flex-col h-full">
            <Tabs
              value={activeFile}
              onValueChange={setActiveFile}
              className="flex flex-col h-full"
            >
              <div className="border-b bg-muted/40">
                <TabsList className="h-10 w-full justify-start rounded-none bg-transparent">
                  {Object.keys(configFiles).map((filename) => (
                    <TabsTrigger
                      key={filename}
                      value={filename}
                      className="data-[state=active]:bg-background rounded-none border-r px-4 py-2 h-10"
                    >
                      {filename}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                {Object.entries(configFiles).map(([filename, content]) => (
                  <TabsContent
                    key={filename}
                    value={filename}
                    className="h-full mt-0 border-none p-0 data-[state=active]:flex-1"
                  >
                    <CodeEditor
                      initialValue={content}
                      language={
                        filename.endsWith(".tf") || filename.endsWith(".hcl")
                          ? "terraform"
                          : filename.endsWith(".json")
                            ? "json"
                            : filename.endsWith(".yaml") ||
                                filename.endsWith(".yml")
                              ? "yaml"
                              : "plaintext"
                      }
                      onSave={handleSaveFile}
                      height="100%"
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </Container>
      </div>

      <div className="border-t bg-muted/40 py-1 px-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span>{provider.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranchPlus className="h-3 w-3" />
              <span>main</span>
            </div>
          </div>
          <div>
            <span>Terraform v1.5.7</span>
          </div>
        </div>
      </div>

      <Dialog open={isPushDialogOpen} onOpenChange={setIsPushDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Push Changes</DialogTitle>
            <DialogDescription>
              Enter a commit message and push your changes to the repository.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={isPushing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Input
                id="commit-message"
                placeholder="Update configuration files"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                disabled={isPushing}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPushDialogOpen(false)}
              disabled={isPushing}
            >
              Cancel
            </Button>
            <Button onClick={submitPushChanges} disabled={isPushing}>
              {isPushing ? (
                <>
                  <GitPullRequest className="mr-2 h-4 w-4 animate-spin" />
                  Pushing...
                </>
              ) : (
                <>
                  <GitCommit className="mr-2 h-4 w-4" />
                  Push
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
