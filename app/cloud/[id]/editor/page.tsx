"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Folder,
  GitCommit,
  GitPullRequest,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CodeEditor } from "@/components/code-editor";
import { useToast } from "@/hooks/use-toast";
import { sampleConfigs } from "@/lib/sampleConfigFiles";
import { useParams } from "next/navigation";
import { useFolderStructure } from "@/hooks/useFolderStructure";

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
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceIcons = {
  folder: <Folder className="h-4 w-4" />,
  file: <FileText className="h-4 w-4" />,
};

interface ServiceFiles {
  [service: string]: {
    [filename: string]: string;
  };
}

export default function EditorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [serviceFiles, setServiceFiles] = useState<ServiceFiles>({});
  const [selectedService, setSelectedService] = useState<string>("");
  const [activeFile, setActiveFile] = useState<string>("");
  const [configName, setConfigName] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedPushService, setSelectedPushService] = useState<string>("");
  const [isPushing, setIsPushing] = useState(false);
  const [expandedServices, setExpandedServices] = useState<
    Record<string, boolean>
  >({});

  const params = useParams();

  const { id } = params as { id: string };

  const { data: folderStructure } = useFolderStructure(id);

  console.log(folderStructure);

  useEffect(() => {
    if (folderStructure) {
      const newServiceFiles: ServiceFiles = {};

      Object.entries(folderStructure).forEach(([provider, services]) => {
        Object.entries(services).forEach(([service, files]) => {
          newServiceFiles[service] = files;
        });
      });

      setServiceFiles(newServiceFiles);

      const firstService = Object.keys(newServiceFiles)[0];
      setSelectedService(firstService);
      setSelectedPushService(firstService);

      // Set the first file of the first service as active
      const firstServiceFiles = newServiceFiles[firstService];
      const firstFile = Object.keys(firstServiceFiles)[0];
      setActiveFile(firstFile);

      // Initialize all services as expanded
      const initialExpandedState: Record<string, boolean> = {};
      Object.keys(newServiceFiles).forEach((service) => {
        initialExpandedState[service] = true;
      });
      setExpandedServices(initialExpandedState);

      setConfigName(`${provider.toUpperCase()} Configuration`);
    } else {
      // Fallback to sample configurations if folderStructure is not available
      const providerFromId = id.split("-")[0];

      if (
        providerFromId &&
        sampleConfigs[providerFromId as keyof typeof sampleConfigs]
      ) {
        setProvider(providerFromId);
        setServiceFiles(
          sampleConfigs[providerFromId as keyof typeof sampleConfigs],
        );

        // Set the first service as selected by default for both editor and push dialog
        const firstService = Object.keys(
          sampleConfigs[providerFromId as keyof typeof sampleConfigs],
        )[0];
        setSelectedService(firstService);
        setSelectedPushService(firstService);

        // Set the first file of the first service as active
        const firstServiceFiles =
          sampleConfigs[providerFromId as keyof typeof sampleConfigs][
            firstService
          ];
        const firstFile = Object.keys(firstServiceFiles)[0];
        setActiveFile(firstFile);

        // Initialize all services as expanded
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(
          sampleConfigs[providerFromId as keyof typeof sampleConfigs],
        ).forEach((service) => {
          initialExpandedState[service] = true;
        });
        setExpandedServices(initialExpandedState);

        setConfigName(`${providerFromId.toUpperCase()} Configuration`);

        // Update page title
        if (window.updatePageTitle) {
          window.updatePageTitle(
            `${providerFromId.toUpperCase()} Configuration - Editor`,
          );
        }
      }
    }
  }, [folderStructure, id]);

  const handleSaveFile = (content: string) => {
    if (selectedService && activeFile) {
      setServiceFiles((prev) => ({
        ...prev,
        [selectedService]: {
          ...prev[selectedService],
          [activeFile]: content,
        },
      }));

      toast({
        title: "File saved",
        description: `${activeFile} has been saved successfully.`,
      });
    }
  };

  const handleSaveAll = () => {
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

    if (!selectedPushService) {
      toast({
        title: "Error",
        description: "Please select a service to push",
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
        description: `Changes for ${formatServiceName(selectedPushService)} have been pushed to the cloud.`,
      });
    }, 2000);
  };

  const toggleServiceExpanded = (service: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    // Select the first file in the service if the current active file is not in this service
    if (!serviceFiles[service][activeFile]) {
      const firstFile = Object.keys(serviceFiles[service])[0];
      setActiveFile(firstFile);
    }
  };

  const handleFileSelect = (service: string, file: string) => {
    setSelectedService(service);
    setActiveFile(file);
  };

  const formatServiceName = (service: string) => {
    return service.charAt(0).toUpperCase() + service.slice(1);
  };

  if (Object.keys(serviceFiles).length === 0) {
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
          <div className="flex h-full">
            {/* Service Navigation Sidebar */}
            <div className="w-64 border-r overflow-y-auto">
              <div className="p-2">
                <h3 className="text-sm font-medium mb-2">Services</h3>
                <div className="space-y-1">
                  {Object.keys(serviceFiles).map((service) => (
                    <div key={service} className="text-sm">
                      <button
                        className="flex items-center w-full hover:bg-muted rounded-md p-1.5 text-left"
                        onClick={() => toggleServiceExpanded(service)}
                      >
                        {expandedServices[service] ? (
                          <ChevronDown className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        )}
                        <span className="flex items-center">
                          {serviceIcons.folder}
                          <span className="ml-1.5">
                            {formatServiceName(service)}
                          </span>
                        </span>
                      </button>

                      {expandedServices[service] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {Object.keys(serviceFiles[service]).map((file) => (
                            <button
                              key={file}
                              className={cn(
                                "flex items-center w-full hover:bg-muted rounded-md p-1.5 text-left text-sm",
                                selectedService === service &&
                                  activeFile === file &&
                                  "bg-muted font-medium",
                              )}
                              onClick={() => handleFileSelect(service, file)}
                            >
                              {serviceIcons.file}
                              <span className="ml-1.5">{file}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {selectedService && activeFile && (
                <>
                  <div className="border-b bg-muted/40 px-4 py-2 flex-shrink-0">
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground mr-2">
                        {formatServiceName(selectedService)} /
                      </span>
                      <span className="font-medium">{activeFile}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <CodeEditor
                      initialValue={serviceFiles[selectedService][activeFile]}
                      language={
                        activeFile.endsWith(".tf") ||
                        activeFile.endsWith(".hcl")
                          ? "terraform"
                          : activeFile.endsWith(".json")
                            ? "json"
                            : activeFile.endsWith(".yaml") ||
                                activeFile.endsWith(".yml")
                              ? "yaml"
                              : "plaintext"
                      }
                      onSave={handleSaveFile}
                      height="100%"
                    />
                  </div>
                </>
              )}
            </div>
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
              Select a service and enter a commit message to push your changes
              to the cloud.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service">Service to Push</Label>
              <Select
                value={selectedPushService}
                onValueChange={setSelectedPushService}
                disabled={isPushing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(serviceFiles).map((service) => (
                    <SelectItem key={service} value={service}>
                      {formatServiceName(service)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
