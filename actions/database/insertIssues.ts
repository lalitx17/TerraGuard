"use server";

import { prisma } from "@/lib/prisma";

interface SeverityCounts {
  CRITICAL: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
}

export async function storeTfsecResults(cloudId: string, scanResults: any) {
  try {
    const severityCounts = countSeverities(scanResults.results);

    // Update the Configuration
    const configuration = await prisma.configuration.update({
      where: { id: cloudId },
      data: {
        isPending: false,
        criticalCount: severityCounts.CRITICAL,
        highCount: severityCounts.HIGH + severityCounts.MEDIUM,
        lowCount: severityCounts.LOW,
      },
    });

    // Create SecurityIssues
    const securityIssues = scanResults.results.map((result: any) => ({
      configurationId: cloudId,
      rule_id: result.rule_id,
      long_id: result.long_id,
      rule_description: result.rule_description,
      rule_provider: result.rule_provider,
      rule_service: result.rule_service,
      impact: result.impact,
      resolution: result.resolution,
      links: result.links,
      description: result.description,
      severity: result.severity,
      warning: result.warning,
      status: result.status,
      resource: result.resource,
      location: result.location,
    }));

    await prisma.securityIssue.createMany({
      data: securityIssues,
    });

    return { success: true, message: "TFSec results stored successfully" };
  } catch (error) {
    console.error("Failed to store TFSec results:", error);
    throw new Error("Failed to store TFSec results");
  }
}

function countSeverities(issues: any[]): SeverityCounts {
  const counts: SeverityCounts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  for (const issue of issues) {
    const severity = issue.severity?.toUpperCase();
    switch (severity) {
      case "CRITICAL":
        counts.CRITICAL++;
        break;
      case "HIGH":
        counts.HIGH++;
        break;
      case "MEDIUM":
        counts.MEDIUM++;
        break;
      case "LOW":
        counts.LOW++;
        break;
      default:
        break;
    }
  }

  return counts;
}
