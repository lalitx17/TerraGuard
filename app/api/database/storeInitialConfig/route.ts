import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, provider } = await req.json();

    if (!name || !provider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newConfig = await prisma.configuration.create({
      data: {
        name: name,
        provider: provider,
        isPending: true,
      },
    });
    return NextResponse.json(newConfig, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while creating the configuration",
        details: error,
      },
      { status: 500 },
    );
  }
}
