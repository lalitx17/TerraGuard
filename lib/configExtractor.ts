import fs from "fs";
import path from "path";

export function TerraformFilesFinder(dir: string): string[] {
  let result: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search in subdirectories
      result = result.concat(TerraformFilesFinder(filePath));
    } else if (
      file.endsWith(".tf") &&
      file !== "outputs.tf" &&
      file !== "provider.tf"
    ) {
      // Add valid `.tf` files to the result array
      result.push(filePath);
    }
  }

  return result;
}
