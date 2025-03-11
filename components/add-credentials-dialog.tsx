"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

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
import { useToast } from "@/components/ui/use-toast";

interface CloudConfig {
  id: string;
  name: string;
  provider: string;
}

export function AddCredentialsDialog({
  open,
  onOpenChange,
  config,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: CloudConfig | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // AWS credentials
  const [awsAccessKey, setAwsAccessKey] = useState("");
  const [awsSecretKey, setAwsSecretKey] = useState("");
  const [awsRegion, setAwsRegion] = useState("");

  // Azure credentials
  const [azureClientId, setAzureClientId] = useState("");
  const [azureClientSecret, setAzureClientSecret] = useState("");
  const [azureTenantId, setAzureTenantId] = useState("");
  const [azureSubscriptionId, setAzureSubscriptionId] = useState("");

  // GCP credentials
  const [gcpProjectId, setGcpProjectId] = useState("");
  const [gcpServiceAccountKey, setGcpServiceAccountKey] = useState("");

  if (!config) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on provider
    if (config.provider === "aws") {
      if (!awsAccessKey || !awsSecretKey || !awsRegion) {
        toast({
          title: "Error",
          description: "Please fill in all AWS credential fields",
          variant: "destructive",
        });
        return;
      }
    } else if (config.provider === "azure") {
      if (
        !azureClientId ||
        !azureClientSecret ||
        !azureTenantId ||
        !azureSubscriptionId
      ) {
        toast({
          title: "Error",
          description: "Please fill in all Azure credential fields",
          variant: "destructive",
        });
        return;
      }
    } else if (config.provider === "gcp") {
      if (!gcpProjectId || !gcpServiceAccountKey) {
        toast({
          title: "Error",
          description: "Please fill in all GCP credential fields",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    //sending request to api/terraloads/getCloudConfig
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Credentials for {config.name}</DialogTitle>
          <DialogDescription>
            Enter the credentials for your {config.provider.toUpperCase()}{" "}
            configuration to extract resources.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            {config.provider === "aws" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="aws-access-key">AWS Access Key ID</Label>
                  <Input
                    id="aws-access-key"
                    value={awsAccessKey}
                    onChange={(e) => setAwsAccessKey(e.target.value)}
                    disabled={isLoading || isSuccess}
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aws-secret-key">AWS Secret Access Key</Label>
                  <Input
                    id="aws-secret-key"
                    type="password"
                    value={awsSecretKey}
                    onChange={(e) => setAwsSecretKey(e.target.value)}
                    disabled={isLoading || isSuccess}
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aws-region">AWS Region</Label>
                  <Input
                    id="aws-region"
                    value={awsRegion}
                    onChange={(e) => setAwsRegion(e.target.value)}
                    disabled={isLoading || isSuccess}
                    placeholder="us-west-2"
                  />
                </div>
              </div>
            )}

            {config.provider === "azure" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="azure-client-id">Client ID</Label>
                  <Input
                    id="azure-client-id"
                    value={azureClientId}
                    onChange={(e) => setAzureClientId(e.target.value)}
                    disabled={isLoading || isSuccess}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="azure-client-secret">Client Secret</Label>
                  <Input
                    id="azure-client-secret"
                    type="password"
                    value={azureClientSecret}
                    onChange={(e) => setAzureClientSecret(e.target.value)}
                    disabled={isLoading || isSuccess}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="azure-tenant-id">Tenant ID</Label>
                  <Input
                    id="azure-tenant-id"
                    value={azureTenantId}
                    onChange={(e) => setAzureTenantId(e.target.value)}
                    disabled={isLoading || isSuccess}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="azure-subscription-id">Subscription ID</Label>
                  <Input
                    id="azure-subscription-id"
                    value={azureSubscriptionId}
                    onChange={(e) => setAzureSubscriptionId(e.target.value)}
                    disabled={isLoading || isSuccess}
                  />
                </div>
              </div>
            )}

            {config.provider === "gcp" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gcp-project-id">Project ID</Label>
                  <Input
                    id="gcp-project-id"
                    value={gcpProjectId}
                    onChange={(e) => setGcpProjectId(e.target.value)}
                    disabled={isLoading || isSuccess}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gcp-service-account-key">
                    Service Account Key (JSON)
                  </Label>
                  <textarea
                    id="gcp-service-account-key"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={gcpServiceAccountKey}
                    onChange={(e) => setGcpServiceAccountKey(e.target.value)}
                    disabled={isLoading || isSuccess}
                    placeholder='{"type": "service_account", "project_id": "your-project-id", ...}'
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || isSuccess}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting the configuration...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Extracted
                </>
              ) : (
                "Extract Configuration"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
