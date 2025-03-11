"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AddCredentialsDialog } from "@/components/add-credentials-dialog";

// Mock data for cloud configurations
const cloudConfigs = {
  "aws-prod": {
    id: "aws-prod",
    name: "AWS Production",
    provider: "aws",
    criticalCount: 3,
    highCount: 7,
    lowCount: 12,
    resources: 124,
    securePercentage: 82,
    issues: [
      {
        id: "aws-issue-1",
        title: "S3 Bucket Publicly Accessible",
        description:
          "The S3 bucket 'company-data' is configured with public read access, exposing sensitive data.",
        severity: "critical",
        resource: "s3://company-data",
        provider: "AWS",
      },
      {
        id: "aws-issue-2",
        title: "IAM User with Admin Privileges",
        description:
          "User 'developer1' has been granted administrator privileges which violates least privilege principle.",
        severity: "critical",
        resource: "iam::user/developer1",
        provider: "AWS",
      },
      {
        id: "aws-issue-3",
        title: "Unencrypted Database",
        description:
          "RDS instance 'production-db' is not configured with encryption at rest.",
        severity: "high",
        resource: "rds:production-db",
        provider: "AWS",
      },
    ],
  },
  "azure-dev": {
    id: "azure-dev",
    name: "Azure Development",
    provider: "azure",
    criticalCount: 1,
    highCount: 4,
    lowCount: 8,
    resources: 78,
    securePercentage: 89,
    issues: [
      {
        id: "azure-issue-1",
        title: "Network Security Group Too Permissive",
        description:
          "NSG allows inbound traffic from any IP address on port 22 (SSH).",
        severity: "high",
        resource: "nsg:dev-servers",
        provider: "Azure",
      },
      {
        id: "azure-issue-2",
        title: "Storage Account with Public Access",
        description: "Storage account 'devfiles' allows public blob access.",
        severity: "critical",
        resource: "storage:devfiles",
        provider: "Azure",
      },
    ],
  },
  "gcp-staging": {
    id: "gcp-staging",
    name: "GCP Staging",
    provider: "gcp",
    criticalCount: 2,
    highCount: 5,
    lowCount: 9,
    resources: 92,
    securePercentage: 85,
    issues: [
      {
        id: "gcp-issue-1",
        title: "Missing Resource Tags",
        description:
          "Multiple resources are missing required organization tags for cost allocation.",
        severity: "low",
        resource: "multiple",
        provider: "GCP",
      },
      {
        id: "gcp-issue-2",
        title: "Default Service Account with Excessive Permissions",
        description:
          "Default service account has project editor role which grants excessive permissions.",
        severity: "critical",
        resource: "iam:default-service-account",
        provider: "GCP",
      },
    ],
  },
  // Add support for dynamically created configurations
  "aws-123": {
    id: "aws-123",
    name: "Production AWS",
    provider: "aws",
    criticalCount: 2,
    highCount: 4,
    lowCount: 7,
    resources: 86,
    securePercentage: 78,
    issues: [
      {
        id: "aws-123-issue-1",
        title: "Root Account Access Keys Active",
        description:
          "The root account has active access keys which is a security risk.",
        severity: "critical",
        resource: "iam::root",
        provider: "AWS",
      },
      {
        id: "aws-123-issue-2",
        title: "Security Groups Allow All Traffic",
        description:
          "Multiple security groups allow all inbound traffic on port 22.",
        severity: "high",
        resource: "sg:multiple",
        provider: "AWS",
      },
    ],
  },
  "azure-456": {
    id: "azure-456",
    name: "Development Azure",
    provider: "azure",
    criticalCount: 0,
    highCount: 1,
    lowCount: 3,
    resources: 42,
    securePercentage: 94,
    issues: [
      {
        id: "azure-456-issue-1",
        title: "Virtual Network Peering Not Secured",
        description:
          "Virtual network peering is not secured with proper gateway transit settings.",
        severity: "high",
        resource: "vnet:dev-network",
        provider: "Azure",
      },
    ],
  },
};

interface CloudConfig {
  id: string;
  name: string;
  provider: string;
  criticalCount?: number;
  highCount?: number;
  lowCount?: number;
  resources?: number;
  securePercentage?: number;
  issues?: any[];
}

export default function CloudConfigPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CloudConfig | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const params = useParams();
  const { id } = params as { id: string };

  useEffect(() => {
    const configId = params.id;

    // Check if this is a pending config
    const pendingConfigs = JSON.parse(
      localStorage.getItem("pendingConfigs") || "[]",
    );
    const isPendingConfig = pendingConfigs.some(
      (c: CloudConfig) => c.id === configId,
    );

    if (isPendingConfig) {
      // Get the pending config details
      const pendingConfig = pendingConfigs.find(
        (c: CloudConfig) => c.id === configId,
      );
      setConfig(pendingConfig);
      setIsPending(true);
      setIsCredentialsDialogOpen(true);
    } else {
      // Get the regular config
      const currentConfig = cloudConfigs[configId as keyof typeof cloudConfigs];

      if (currentConfig) {
        setConfig(currentConfig);

        // Update the title using the global method
        if (window.updatePageTitle) {
          window.updatePageTitle(currentConfig.name);
        }
      }
    }
  }, [params.id]);

  if (!config) {
    return (
      <div className="w-full py-6">
        <Container>
          <div className="p-8">Loading configuration...</div>
        </Container>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="w-full py-6">
        <Container>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{config.name}</h2>
            <p className="text-muted-foreground mb-6">
              This configuration requires credentials to extract resources.
            </p>
            <Button onClick={() => setIsCredentialsDialogOpen(true)}>
              Add Credentials
            </Button>

            <AddCredentialsDialog
              open={isCredentialsDialogOpen}
              onOpenChange={setIsCredentialsDialogOpen}
              config={config}
            />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <Container>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">{config.name}</h2>
          <Button variant="outline">
            Rescan Configuration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Issues
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.criticalCount}</div>
              <p className="text-xs text-muted-foreground">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Severity
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.highCount}</div>
              <p className="text-xs text-muted-foreground">
                Should be addressed soon
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Severity
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.lowCount}</div>
              <p className="text-xs text-muted-foreground">
                Best practice recommendations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Secure Resources
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {config.securePercentage}%
              </div>
              <Progress value={config.securePercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Issues</CardTitle>
                <CardDescription>
                  All detected issues in {config.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {config.issues?.map((issue: any) => (
                      <div
                        key={issue.id}
                        className="flex items-start gap-4 rounded-lg border p-4"
                      >
                        {issue.severity === "critical" ? (
                          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                        ) : issue.severity === "high" ? (
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                        ) : (
                          <ShieldCheck className="mt-0.5 h-5 w-5 text-yellow-500" />
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="font-medium leading-none">
                            {issue.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {issue.description}
                          </p>
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground">
                              {issue.resource}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Fix
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Security Issues</CardTitle>
                <CardDescription>
                  Issues that require immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {config.issues
                      ?.filter((issue: any) => issue.severity === "critical")
                      .map((issue: any) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">
                              {issue.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {issue.description}
                            </p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">
                                {issue.resource}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Fix
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="high" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>High Severity Issues</CardTitle>
                <CardDescription>
                  Issues that should be addressed soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {config.issues
                      ?.filter((issue: any) => issue.severity === "high")
                      .map((issue: any) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">
                              {issue.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {issue.description}
                            </p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">
                                {issue.resource}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Fix
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="low" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Severity Issues</CardTitle>
                <CardDescription>Best practice recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {config.issues
                      ?.filter((issue: any) => issue.severity === "low")
                      .map((issue: any) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <ShieldCheck className="mt-0.5 h-5 w-5 text-yellow-500" />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">
                              {issue.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {issue.description}
                            </p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">
                                {issue.resource}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Fix
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>

      <AddCredentialsDialog
        open={isCredentialsDialogOpen}
        onOpenChange={setIsCredentialsDialogOpen}
        config={config}
      />
    </div>
  );
}
