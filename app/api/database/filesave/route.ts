// app/api/update-file/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { cloudId, folderName, fileName, content } = await request.json();

    // Validate required parameters
    if (!cloudId || !folderName || !fileName || !content) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Construct full file path
    const workingDir = path.join(
      process.cwd(),
      "tmp",
      `terraformer-${cloudId}`,
      "generated",
      "aws",
      folderName,
    );

    const filePath = path.join(workingDir, fileName);

    // Security check to prevent path traversal
    const normalizedPath = path.resolve(filePath);
    const basePath = path.resolve(path.join(process.cwd(), "tmp"));

    if (!normalizedPath.startsWith(basePath)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Create directory if it doesn't exist
    await fs.mkdir(workingDir, { recursive: true });

    // Write file contents
    await fs.writeFile(filePath, content, "utf8");

    return NextResponse.json(
      { success: true, message: "File updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("File update error:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 },
    );
  }
}
