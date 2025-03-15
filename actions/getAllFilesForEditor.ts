"use server";

import { readdirSync, readFileSync } from "fs";
import path from "path";

export async function getFolderStructure(cloudId: string) {
  const workingDir = path.join(
    process.cwd(),
    "tmp",
    `terraformer-${cloudId}`,
    "generated",
  );

  const folderStructure: Record<
    string,
    Record<string, Record<string, string>>
  > = {};

  try {
    const cloudProviders = readdirSync(workingDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const cloudProvider of cloudProviders) {
      const cloudProviderPath = path.join(workingDir, cloudProvider);
      folderStructure[cloudProvider] = {};

      const services = readdirSync(cloudProviderPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      for (const service of services) {
        const servicePath = path.join(cloudProviderPath, service);
        folderStructure[cloudProvider][service] = {};

        const files = readdirSync(servicePath, { withFileTypes: true })
          .filter((dirent) => dirent.isFile())
          .map((dirent) => dirent.name);

        for (const file of files) {
          const filePath = path.join(servicePath, file);
          const content = readFileSync(filePath, "utf-8");
          folderStructure[cloudProvider][service][file] = content;
        }
      }
    }

    console.log(folderStructure);

    return folderStructure;
  } catch (error) {
    console.error("Error reading folder structure:", error);
    throw new Error("Failed to read folder structure");
  }
}
