"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Code,
  ExternalLink,
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
import { useConfigurationById } from "@/hooks/use-config-by-id";
import { cloudConfigs } from "@/lib/mockData";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CloudConfig, SecurityIssue } from "@/types/config";
import { useContextForAI } from "@/hooks/use-aiContext";

export default function CloudConfigPage() {
  const router = useRouter();
  const [config, setConfig] = useState<CloudConfig | null>(null);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const params = useParams();
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(
    null,
  );
  const [isFixDialogOpen, setIsFixDialogOpen] = useState(false);
  const { id } = params as { id: string };

  const { data: configuration, isLoading, isError } = useConfigurationById(id);

  useEffect(() => {
    if (configuration && "id" in configuration) {
      setConfig(configuration);

      if (window.updatePageTitle) {
        window.updatePageTitle(configuration.name);
      }
    } else {
      // Fallback to mock data with type assertion
      const mockConfig = cloudConfigs[id as keyof typeof cloudConfigs];
      if (mockConfig) {
        setConfig(mockConfig);
      }
    }
  }, [configuration, id]);

  useEffect(() => {
    if (config) {
      // Update the title using the global method
      if (window.updatePageTitle) {
        window.updatePageTitle(config.name);
      }
    }
  }, [config]);

  if (!config) {
    return (
      <div className="w-full py-6">
        <Container>
          <div className="p-8">Loading configuration...</div>
        </Container>
      </div>
    );
  }

  const handleFixIssue = (issue: SecurityIssue) => {
    setSelectedIssue(issue);
    setIsFixDialogOpen(true);
  };

  const handleFixIssueWithAI = async (issue: SecurityIssue) => {
    const params = new URLSearchParams({ issueId: issue.id });
    const url = `/api/database/contextforai?${params}`;

    const contextResponse = await fetch(url);
    const contextData = await contextResponse.json();
    const context = contextData.context;

    if (context) {
      const response = await fetch("/api/ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Please provide a fix for the following security issue:\n\n${context}`,
            },
          ],
        }),
      });
    }
  };

  if (config.isPending) {
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
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/cloud/${params.id}/editor`)}>
              <Code className="mr-2 h-4 w-4" />
              Edit Configuration
            </Button>
            <Button variant="outline">
              Rescan Configuration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
                {config.SecurePercentage}%
              </div>
              <Progress value={config.SecurePercentage} className="mt-2" />
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
                    {config.issues?.map((issue) => (
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium leading-none">
                              {issue.rule_description}
                            </p>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {issue.rule_id ||
                                `${issue.rule_provider?.toUpperCase()}-${issue.id}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {issue.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {issue.resource}
                            </span>
                            {issue.rule_service && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                Service: {issue.rule_service}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFixIssue(issue)}
                        >
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
                      ?.filter(
                        (issue) =>
                          issue.severity === "critical" ||
                          issue.severity === "CRITICAL",
                      )
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium leading-none">
                                {issue.rule_description}
                              </p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {issue.rule_id ||
                                  `${issue.rule_provider?.toUpperCase()}-${issue.id}`}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {issue.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {issue.resource}
                              </span>
                              {issue.rule_service && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  Service: {issue.rule_service}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFixIssue(issue)}
                          >
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
                      ?.filter(
                        (issue) =>
                          issue.severity === "high" ||
                          issue.severity === "HIGH" ||
                          issue.severity === "MEDIUM",
                      )
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium leading-none">
                                {issue.rule_description}
                              </p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {issue.rule_id ||
                                  `${issue.rule_provider?.toUpperCase()}-${issue.id}`}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {issue.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {issue.resource}
                              </span>
                              {issue.rule_service && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  Service: {issue.rule_service}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFixIssue(issue)}
                          >
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
                      ?.filter(
                        (issue) =>
                          issue.severity === "low" || issue.severity === "LOW",
                      )
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-4 rounded-lg border p-4"
                        >
                          <ShieldCheck className="mt-0.5 h-5 w-5 text-yellow-500" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium leading-none">
                                {issue.rule_description}
                              </p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {issue.rule_id ||
                                  `${issue.rule_provider?.toUpperCase()}-${issue.id}`}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {issue.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {issue.resource}
                              </span>
                              {issue.rule_service && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  Service: {issue.rule_service}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFixIssue(issue)}
                          >
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

      {/* Fix Issue Dialog */}
      <Dialog open={isFixDialogOpen} onOpenChange={setIsFixDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Fix Security Issue</DialogTitle>
            <DialogDescription>
              {selectedIssue?.rule_id} - {selectedIssue?.rule_description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-sm font-medium">Resource</h3>
              <p className="text-sm">{selectedIssue?.resource}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Impact</h3>
              <p className="text-sm">{selectedIssue?.impact}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Resolution</h3>
              <p className="text-sm">{selectedIssue?.resolution}</p>
            </div>

            {selectedIssue?.links && selectedIssue.links.length > 0 && (
              <div>
                <h3 className="text-sm font-medium">Documentation</h3>
                <div className="space-y-2 mt-2">
                  {selectedIssue.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {link.length > 60 ? `${link.substring(0, 60)}...` : link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Fix Options</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/cloud/${params.id}/editor`)}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Edit Configuration Manually
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    if (selectedIssue) {
                      handleFixIssueWithAI(selectedIssue);
                    }
                  }}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Apply Automatic Fix
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFixDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
