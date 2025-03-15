import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const config = {
  runtime: "nodejs",
};

export async function POST(request: Request) {
  let tempDir: string | null = null;

  try {
    const { service, cloudId, awsAccessKey, awsSecretKey, region } =
      await request.json();

    // Validate input
    if (!service || !cloudId || !awsSecretKey || !awsAccessKey || !region) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const serviceLower = service.toLowerCase();

    const workingDir = path.join(
      process.cwd(),
      "tmp",
      `terraformer-${cloudId}`,
      "generated",
      "aws",
      serviceLower,
    );

    if (!fs.existsSync(workingDir)) {
      return NextResponse.json(
        { error: "Service directory not found" },
        { status: 404 }, // Changed from 402 to proper 404
      );
    }

    // Create temporary directory
    tempDir = path.join(
      process.cwd(),
      "tmp2",
      `terraform-${cloudId}-${Date.now()}`,
    );
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy files to temp directory
    fs.cpSync(workingDir, tempDir, { recursive: true });

    // Configure environment variables
    process.env.AWS_ACCESS_KEY_ID = awsAccessKey;
    process.env.AWS_SECRET_ACCESS_KEY = awsSecretKey;
    process.env.AWS_REGION = region;

    const commands = ["terraform init", "terraform apply -auto-approve"];

    const logs = [];

    for (const command of commands) {
      try {
        const { stdout, stderr } = await execAsync(command, {
          cwd: tempDir, // Use temp directory
        });
        logs.push({
          command,
          stdout,
          stderr,
        });
      } catch (error) {
        console.error(`Command failed: ${command}`, error);
        throw error;
      }
    }

    return NextResponse.json({
      status: "success",
      logs,
    });
  } catch (error) {
    console.error("Terraform Error:", error);
    return NextResponse.json(
      { error: "Terraform operation failed", details: error },
      { status: 500 },
    );
  }
  //   finally {
  //     // Cleanup temp directory
  //     if (tempDir && fs.existsSync(tempDir)) {
  //       try {
  //         fs.rmSync(tempDir, { recursive: true, force: true });
  //       } catch (cleanupError) {
  //         console.error("Cleanup failed:", cleanupError);
  //       }
  //     }
  //   }
}
