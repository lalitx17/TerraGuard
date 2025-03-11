import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { NextResponse } from "next/server";
import generateTerraformConfig from "@/lib/generateTerraformConfig";
import { TerraformFilesFinder } from "@/lib/configExtractor";

const execPromise = promisify(exec);

interface credentialsRequest {
  provider: string;
  access_key: string;
  secret_key: string;
  region: string;
}

const allRegions =
  "us-east-1,us-east-2,us-west-1,us-west-2,ap-northeast-1,ap-northeast-2,ap-south-1,ap-southeast-1,ap-southeast-2,ca-central-1,eu-central-1,eu-north-1,eu-west-1,eu-west-2,eu-west-3,sa-east-1";

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

    const destinationDir = path.join(process.cwd(), "configs");
    fs.mkdirSync(destinationDir, { recursive: true });

    const versionTfPath = path.join(workingDir, "version.tf");
    fs.writeFileSync(versionTfPath, generateTerraformConfig("aws", region));

    // Set environment variables for AWS credentials
    const env = {
      ...process.env,
      AWS_ACCESS_KEY_ID: access_key,
      AWS_SECRET_ACCESS_KEY: secret_key,
      AWS_REGION: region,
    };

    // Run terraform init
    console.log("Running terraform init...");
    await execPromise("terraform init", {
      cwd: workingDir,
      env,
    });

    // Run terraformer
    const terraformerCommand = `terraformer import aws --resources=* --regions=${allRegions} --excludes="identitystore"`;

    console.log(`Running command: ${terraformerCommand}`);

    const { stdout, stderr } = await execPromise(terraformerCommand, {
      cwd: workingDir,
      env,
    });
    console.log("Terraformer stdout:", stdout);

    if (stderr) {
      console.warn("Terraformer stderr:", stderr);
    }

    const generatedDir = path.join(workingDir, "generated");

    const tfFiles = TerraformFilesFinder(generatedDir);

    for (const file of tfFiles) {
      const dirName = path.dirname(file).split(path.sep).pop() as string;

      const destDir = path.join(destinationDir, dirName);
      fs.mkdirSync(destDir, { recursive: true });

      const destPath = path.join(destDir, path.basename(file));
      fs.copyFileSync(file, destPath);
    }

    // fs.rmSync(workingDir, { recursive: true, force: true });

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
