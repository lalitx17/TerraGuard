import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import generateTerraformConfig from "../../lib/generateTerraformConfig";

const execPromise = promisify(exec);

interface credentialsRequest {
  provider: string;
  accessKey: string;
  secretKey: string;
  region: string;
}

interface CloudConfigResponse {
  config?: string;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CloudConfigResponse>,
) {
  if (req.method != "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { provider, accessKey, secretKey, region } =
      req.body as credentialsRequest;

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      AWS_ACCESS_KEY_ID: accessKey,
      AWS_SECRET_ACCESS_KEY: secretKey,
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

    const terraformerCommand = `terraformer import aws --resources=instance,vpc --access-key=${accessKey} --secret-key=${secretKey} --region=${region} --path-output=${outputDir}`;
    console.log(`Running command: ${terraformerCommand}`);

    await execPromise(terraformerCommand, { env });

    const tfFilePath = path.join(outputDir, "aws_instance.tf");
    const destinationFilePath = path.join(destinationDir, "aws_instance.tf");

    fs.copyFileSync(tfFilePath, destinationFilePath);

    fs.rmSync(outputDir, { recursive: true, force: true });

    const tfConfig = fs.readFileSync(tfFilePath, "utf-8");

    res.status(200).json({ config: tfConfig });
  } catch (error) {
    console.error("Error generating configuration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Failed to get existing configuration",
      error: errorMessage,
    });
  }
}
