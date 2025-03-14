"use client";

import { useQuery } from "@tanstack/react-query";
import { getFolderStructure } from "@/actions/getAllFilesForEditor";

export function useFolderStructure(cloudId: string) {
  return useQuery({
    queryKey: ["folderStructure", cloudId],
    queryFn: () => getFolderStructure(cloudId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
