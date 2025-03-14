"use server";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const getConfigurationById = async (id: string) => {
  try {
    const config = await prisma.configuration.findUnique({
      where: {
        id: id,
      },
      include: {
        issues: true,
      },
    });

    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 },
      );
    }

    return config;
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching the configuration",
        details: error,
      },
      { status: 500 },
    );
  }
};
