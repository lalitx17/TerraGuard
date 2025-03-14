"use client";

import { useQuery } from "@tanstack/react-query";
import { getConfigurationById } from "@/actions/database/getConfigById";

export const useConfigurationById = (id: string) => {
  return useQuery({
    queryKey: ["configuration", id],
    queryFn: () => getConfigurationById(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
