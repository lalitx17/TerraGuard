import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const configs = await prisma.configuration.findMany({
      include: {
        issues: true,
      },
    });

    return NextResponse.json(configs);
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching the configurations",
        details: error,
      },
      { status: 500 },
    );
  }
}
