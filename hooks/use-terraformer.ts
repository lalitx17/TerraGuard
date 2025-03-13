// hooks/use-terraformer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { CredentialsRequest } from "@/actions/terraform/getCloudConfigs";
import { generateTerraformConfigAction } from "@/actions/terraform/getCloudConfigs";

export function useGenerateTerraformConfig() {
  return useMutation<
    { success: boolean; message: string; files: string[] },
    Error,
    CredentialsRequest
  >({
    mutationFn: async (credentials) => {
      try {
        return await generateTerraformConfigAction(credentials);
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to generate configuration",
        );
      }
    },
    onSuccess: (data) => {
      console.log("Configuration generated:", data.files);
    },
    onError: (error) => {
      console.error("Configuration error:", error.message);
    },
  });
}
