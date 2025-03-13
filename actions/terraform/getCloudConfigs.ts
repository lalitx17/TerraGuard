"use server";

import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import generateTerraformConfig from "@/lib/generateTerraformConfig";
import { TerraformFilesFinder } from "@/lib/configExtractor";

const execPromise = promisify(exec);

export interface CredentialsRequest {
  cloudId: string;
  provider: string;
  access_key: string;
  secret_key: string;
  region: string;
}

export async function generateTerraformConfigAction({
  cloudId,
  provider,
  access_key,
  secret_key,
  region,
}: CredentialsRequest) {
  try {
    // Create working directories
    const workingDir = path.join(
      process.cwd(),
      "tmp",
      `terraformer-${cloudId}`,
    );
    const destinationDir = path.join(process.cwd(), "configs");

    fs.mkdirSync(workingDir, { recursive: true });
    fs.mkdirSync(destinationDir, { recursive: true });

    // Generate Terraform version config
    const versionTfPath = path.join(workingDir, "version.tf");
    fs.writeFileSync(versionTfPath, generateTerraformConfig("aws", region));

    // Configure AWS environment
    const env = {
      ...process.env,
      AWS_ACCESS_KEY_ID: access_key,
      AWS_SECRET_ACCESS_KEY: secret_key,
      AWS_REGION: region,
    };

    // Initialize Terraform
    console.log("Initializing Terraform...");
    await execPromise("terraform init", { cwd: workingDir, env });

    // Run Terraformer import
    const terraformerCommand = `terraformer import aws --resources=* --regions=${region} --excludes="identitystore"`;
    console.log(`Executing: ${terraformerCommand}`);

    const { stdout, stderr } = await execPromise(terraformerCommand, {
      cwd: workingDir,
      env,
    });

    if (stderr) console.warn("Terraformer warnings:", stderr);

    // Process generated files
    const generatedDir = path.join(workingDir, "generated");
    const tfFiles = TerraformFilesFinder(generatedDir);

    tfFiles.forEach((file) => {
      const dirName = path.dirname(file).split(path.sep).pop()!;
      const destDir = path.join(destinationDir, dirName);

      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(file, path.join(destDir, path.basename(file)));
    });

    // Cleanup (uncomment when ready)
    // fs.rmSync(workingDir, { recursive: true, force: true });

    return {
      success: true,
      message: "Configuration generated successfully",
      files: tfFiles.map((f) => path.relative(destinationDir, f)),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Configuration generation failed:", errorMessage);
    throw new Error(`Terraform generation failed: ${errorMessage}`);
  }
}
