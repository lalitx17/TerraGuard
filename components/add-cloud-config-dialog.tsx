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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

export function AddCloudConfigDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [configName, setConfigName] = useState("");
  const [provider, setProvider] = useState("aws");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!configName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a configuration name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // call to api/database/storeInitialConfig

    try {
      const response = await fetch("/api/database/storeInitialConfig", {
        method: "POST",
        body: JSON.stringify({
          name: configName,
          provider: provider,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        setConfigName("");
        router.refresh();
        toast({
          title: "Configuration Added",
          description:
            "Basic configuration has been added. Please add credentials next.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding Configuration: ", error);
    } finally {
      setTimeout(() => {
        setIsSuccess(false);
      }, 500);
      onOpenChange(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Cloud Configuration</DialogTitle>
          <DialogDescription>
            Enter the basic information for your cloud configuration.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Configuration Name</Label>
              <Input
                id="name"
                placeholder="Production AWS"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                disabled={isLoading || isSuccess}
              />
            </div>
            <div className="grid gap-2">
              <Label>Cloud Provider</Label>
              <RadioGroup
                value={provider}
                onValueChange={setProvider}
                disabled={isLoading || isSuccess}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aws" id="aws" />
                  <Label htmlFor="aws" className="cursor-pointer">
                    AWS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="azure" id="azure" />
                  <Label htmlFor="azure" className="cursor-pointer">
                    Azure
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gcp" id="gcp" />
                  <Label htmlFor="gcp" className="cursor-pointer">
                    Google Cloud
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || isSuccess}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added
                </>
              ) : (
                "Add Configuration"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
