"use server";

import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

export async function runTfsecScanAction(cloudId: string) {
  try {
    const workingDir = path.join(
      process.cwd(),
      "tmp",
      `terraformer-${cloudId}`,
      "generated",
      "aws",
    );
    const destinationDir = path.join(process.cwd(), "configs");

    // Verify generated files exist
    if (!fs.existsSync(workingDir)) {
      throw new Error("No generated Terraform files found");
    }

    // Run tfsec scan
    console.log(`Starting TFSec scan for cloud ${cloudId}`);
    const command = "tfsec . --format=json";

    let stdout;
    try {
      ({ stdout } = await execPromise(command, { cwd: workingDir }));
    } catch (error) {
      // TFSec returns non-zero exit code when findings exist, but we still want the results
      stdout = (error as any).stdout;
      if (!stdout) throw error;
    }

    // Parse and save results
    const results = JSON.parse(stdout);
    const outputPath = path.join(destinationDir, `tfsec-scan-${cloudId}.json`);

    fs.mkdirSync(destinationDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    return {
      success: true,
      message: "TFSec scan completed",
      results: results,
      outputPath: outputPath,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("TFSec scan failed:", errorMessage);
    throw new Error(`TFSec scan failed: ${errorMessage}`);
  }
}
