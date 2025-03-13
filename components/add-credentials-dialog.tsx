"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

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
import { useToast } from "@/hooks/use-toast";
import { useGenerateTerraformConfig } from "@/hooks/use-terraformer";

// AWS Credentials State
interface AWSState {
  awsAccessKey: string;
  awsSecretKey: string;
  awsRegion: string;
}

// Azure Credentials State
interface AzureState {
  azureClientId: string;
  azureClientSecret: string;
  azureTenantId: string;
  azureSubscriptionId: string;
}

// GCP Credentials State
interface GCPState {
  gcpProjectId: string;
  gcpServiceAccountKey: string;
}

// Provider specific credential input fields
function AWSCredentials({
  awsAccessKey,
  setAwsAccessKey,
  awsSecretKey,
  setAwsSecretKey,
  awsRegion,
  setAwsRegion,
  isLoading,
  isSuccess,
}: AWSState & {
  setAwsAccessKey: (value: string) => void;
  setAwsSecretKey: (value: string) => void;
  setAwsRegion: (value: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
}) {
  return (
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
  );
}

function AzureCredentials({
  azureClientId,
  setAzureClientId,
  azureClientSecret,
  setAzureClientSecret,
  azureTenantId,
  setAzureTenantId,
  azureSubscriptionId,
  setAzureSubscriptionId,
  isLoading,
  isSuccess,
}: AzureState & {
  setAzureClientId: (value: string) => void;
  setAzureClientSecret: (value: string) => void;
  setAzureTenantId: (value: string) => void;
  setAzureSubscriptionId: (value: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
}) {
  return (
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
  );
}

function GCPCredentials({
  gcpProjectId,
  setGcpProjectId,
  gcpServiceAccountKey,
  setGcpServiceAccountKey,
  isLoading,
  isSuccess,
}: GCPState & {
  setGcpProjectId: (value: string) => void;
  setGcpServiceAccountKey: (value: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
}) {
  return (
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
  );
}

// Provider specific validation
const validateAWS = (
  awsAccessKey: string,
  awsSecretKey: string,
  awsRegion: string,
  toast: any,
) => {
  if (!awsAccessKey || !awsSecretKey || !awsRegion) {
    toast({
      title: "Error",
      description: "Please fill in all AWS credential fields",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

const validateAzure = (
  azureClientId: string,
  azureClientSecret: string,
  azureTenantId: string,
  azureSubscriptionId: string,
  toast: any,
) => {
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
    return false;
  }
  return true;
};

const validateGCP = (
  gcpProjectId: string,
  gcpServiceAccountKey: string,
  toast: any,
) => {
  if (!gcpProjectId || !gcpServiceAccountKey) {
    toast({
      title: "Error",
      description: "Please fill in all GCP credential fields",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

const submitAWS = async (
  access_key: string,
  secret_key: string,
  region: string,
  cloudId: string,
  mutateAsync: any,
  toast: any,
  provider: string = "aws",
) => {
  try {
    const result = await mutateAsync({
      cloudId,
      provider,
      access_key,
      secret_key,
      region,
    });

    if (result.success) {
      console.log(result.files);
      return true;
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to extract configuration",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to extract configuration",
      variant: "destructive",
    });
    return false;
  }
};

const submitAzure = async (
  azureClientId: string,
  azureClientSecret: string,
  azureTenantId: string,
  azureSubscriptionId: string,
  cloudId: string,
  mutateAsync: any,
  toast: any,
) => {
  try {
    const result = await mutateAsync({
      cloudId,
      provider: "azure",
      azureClientId,
      azureClientSecret,
      azureTenantId,
      azureSubscriptionId,
    });

    if (result.success) {
      console.log(result.files);
      return true;
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to extract configuration",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to extract configuration",
      variant: "destructive",
    });
    return false;
  }
};

const submitGCP = async (
  gcpProjectId: string,
  gcpServiceAccountKey: string,
  cloudId: string,
  mutateAsync: any,
  toast: any,
) => {
  try {
    const result = await mutateAsync({
      cloudId,
      provider: "gcp",
      gcpProjectId,
      gcpServiceAccountKey,
    });

    if (result.success) {
      console.log(result.files);
      return true;
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to extract configuration",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to extract configuration",
      variant: "destructive",
    });
    return false;
  }
};

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

  const { mutateAsync } = useGenerateTerraformConfig();

  const { id } = useParams() as { id: string };

  if (!config) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    let isValid = false;

    // Validate and Submit based on provider
    if (config.provider === "aws") {
      isValid = validateAWS(awsAccessKey, awsSecretKey, awsRegion, toast);
      if (isValid) {
        isValid = await submitAWS(
          awsAccessKey,
          awsSecretKey,
          awsRegion,
          id,
          mutateAsync,
          toast,
        );
      }
    } else if (config.provider === "azure") {
      isValid = validateAzure(
        azureClientId,
        azureClientSecret,
        azureTenantId,
        azureSubscriptionId,
        toast,
      );
      if (isValid) {
        isValid = await submitAzure(
          azureClientId,
          azureClientSecret,
          azureTenantId,
          azureSubscriptionId,
          id,
          mutateAsync,
          toast,
        );
      }
    } else if (config.provider === "gcp") {
      isValid = validateGCP(gcpProjectId, gcpServiceAccountKey, toast);
      if (isValid) {
        isValid = await submitGCP(
          gcpProjectId,
          gcpServiceAccountKey,
          id,
          mutateAsync,
          toast,
        );
      }
    }

    setIsLoading(false);
    setIsSuccess(isValid);
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
              <AWSCredentials
                awsAccessKey={awsAccessKey}
                setAwsAccessKey={setAwsAccessKey}
                awsSecretKey={awsSecretKey}
                setAwsSecretKey={setAwsSecretKey}
                awsRegion={awsRegion}
                setAwsRegion={setAwsRegion}
                isLoading={isLoading}
                isSuccess={isSuccess}
              />
            )}
            {config.provider === "azure" && (
              <AzureCredentials
                azureClientId={azureClientId}
                setAzureClientId={setAzureClientId}
                azureClientSecret={azureClientSecret}
                setAzureClientSecret={setAzureClientSecret}
                azureTenantId={azureTenantId}
                setAzureTenantId={setAzureTenantId}
                azureSubscriptionId={azureSubscriptionId}
                setAzureSubscriptionId={setAzureSubscriptionId}
                isLoading={isLoading}
                isSuccess={isSuccess}
              />
            )}
            {config.provider === "gcp" && (
              <GCPCredentials
                gcpProjectId={gcpProjectId}
                setGcpProjectId={setGcpProjectId}
                gcpServiceAccountKey={gcpServiceAccountKey}
                setGcpServiceAccountKey={setGcpServiceAccountKey}
                isLoading={isLoading}
                isSuccess={isSuccess}
              />
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
