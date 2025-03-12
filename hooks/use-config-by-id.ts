"use client";

import { useQuery } from "@tanstack/react-query";
import { getConfigurationById } from "@/actions/getConfigById";
import type { Configuration } from "@prisma/client";

export const useConfigurationById = (id: string) => {
  return useQuery({
    queryKey: ["configuration", id],
    queryFn: () => getConfigurationById(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
