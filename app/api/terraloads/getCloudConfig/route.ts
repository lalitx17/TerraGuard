import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { NextResponse } from "next/server";

const execPromise = promisify(exec);

interface credentialsRequest {
  provider: string;
  access_key: string;
  secret_key: string;
  region: string;
}

export async function POST(request: Request) {
  try {
    const { provider, access_key, secret_key, region } =
      (await request.json()) as credentialsRequest;

    // Create a working directory
    const workingDir = path.join(
      process.cwd(),
      "tmp",
      `terraformer-${Date.now()}`,
    );
    fs.mkdirSync(workingDir, { recursive: true });

    // Create AWS credentials file
    const awsCredentialsContent = `
[default]
aws_access_key_id = ${access_key}
aws_secret_access_key = ${secret_key}
region = ${region}
`;

    const awsConfigPath = path.join(process.cwd(), "tmp", ".aws-config-temp");
    fs.writeFileSync(awsConfigPath, awsCredentialsContent);

    // Create version.tf file
    const versionTfContent = `
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "${region}"
}
`;

    const versionTfPath = path.join(workingDir, "version.tf");
    fs.writeFileSync(versionTfPath, versionTfContent);

    // Set environment variables for AWS credentials
    const env = {
      ...process.env,
      AWS_ACCESS_KEY_ID: access_key,
      AWS_SECRET_ACCESS_KEY: secret_key,
      AWS_REGION: region,
      AWS_CONFIG_FILE: awsConfigPath,
      AWS_SHARED_CREDENTIALS_FILE: awsConfigPath,
    };

    // Create destination directory for configs
    const destinationDir = path.join(process.cwd(), "configs");
    fs.mkdirSync(destinationDir, { recursive: true });

    // Run terraform init
    console.log("Running terraform init...");
    await execPromise("terraform init", {
      cwd: workingDir,
      env,
    });

    // Run terraformer
    const terraformerCommand = `terraformer import aws --resources=s3 --regions=${region}`;
    console.log(`Running command: ${terraformerCommand}`);

    const { stdout, stderr } = await execPromise(terraformerCommand, {
      cwd: workingDir,
      env,
    });
    console.log("Terraformer stdout:", stdout);

    if (stderr) {
      console.warn("Terraformer stderr:", stderr);
    }

    // Copy generated files to destination directory
    const files = fs.readdirSync(workingDir);
    const tfFiles = files.filter(
      (file) => file.endsWith(".tf") || file.endsWith(".json"),
    );

    for (const file of tfFiles) {
      const sourcePath = path.join(workingDir, file);
      const destPath = path.join(destinationDir, file);
      fs.copyFileSync(sourcePath, destPath);
    }

    // Clean up temporary files
    // fs.rmSync(workingDir, { recursive: true, force: true });
    fs.unlinkSync(awsConfigPath);

    return NextResponse.json({
      success: true,
      message: "Terraform configuration generated successfully",
      files: tfFiles,
    });
  } catch (error) {
    console.error("Error generating configuration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate configuration: ${errorMessage}` },
      { status: 500 },
    );
  }
}
