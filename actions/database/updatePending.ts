"use server";

import { prisma } from "@/lib/prisma";

export async function updateConfigurationStatus(id: string) {
  try {
    const updatedConfig = await prisma.configuration.update({
      where: { id },
      data: { isPending: false },
    });

    return { success: true, data: updatedConfig };
  } catch (error) {
    console.error("Error updating configuration:", error);
    return { success: false, error: "Failed to update configuration status" };
  }
}
