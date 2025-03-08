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

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      AWS_ACCESS_KEY_ID: access_key,
      AWS_SECRET_ACCESS_KEY: secret_key,
      AWS_DEFAULT_REGION: region,
    };

    const outputDir = path.join(
      process.cwd(),
      "tmp",
      `terraformer-${Date.now()}`,
    );
    fs.mkdirSync(outputDir, { recursive: true });

    const destinationDir = path.join(process.cwd(), "configs");
    fs.mkdirSync(destinationDir, { recursive: true });

    const terraformerCommand = `terraformer import aws --resources=instance,vpc --access-key=${access_key} --secret-key=${secret_key} --region=${region} --path-output=${outputDir}`;
    console.log(`Running command: ${terraformerCommand}`);

    await execPromise(terraformerCommand, { env });

    const tfFilePath = path.join(outputDir, "aws_instance.tf");
    const destinationFilePath = path.join(destinationDir, "aws_instance.tf");

    fs.copyFileSync(tfFilePath, destinationFilePath);

    fs.rmSync(outputDir, { recursive: true, force: true });

    const tfConfig = fs.readFileSync(tfFilePath, "utf-8");

    return NextResponse.json({ config: tfConfig });
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
