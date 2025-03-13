"use client";

import { useMutation } from "@tanstack/react-query";
import { runTfsecScanAction } from "@/actions/tfsec/tfsecTest";

export function useTfsecScan() {
  return useMutation({
    mutationKey: ["tfsecScan"],
    mutationFn: async (cloudId: string) => {
      const result = await runTfsecScanAction(cloudId);

      return {
        success: result.success,
        message: result.message,
        results: result.results as TfsecResults,
        outputPath: result.outputPath,
      };
    },
    onError: (error: Error) => ({
      success: false,
      message: error.message,
      results: null,
      outputPath: null,
    }),
  });
}

// Type definitions
export type TfsecResult = {
  rule_id: string;
  long_id: string;
  rule_description: string;
  rule_provider: string;
  link: string;
  location: {
    filename: string;
    start_line: number;
    end_line: number;
  };
  description: string;
  severity: string;
};

export type TfsecResults = {
  results: TfsecResult[];
  statistics: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
};
