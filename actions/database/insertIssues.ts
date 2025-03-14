"use server";

import { prisma } from "@/lib/prisma";

export async function storeTfsecResults(cloudId: string, scanResults: any) {
  try {
    // update the Configuration
    const configuration = await prisma.configuration.update({
      where: { id: cloudId },
      data: {
        isPending: false,
        // criticalCount: scanResults.summary.count.critical || 0,
        // highCount: scanResults.summary.count.high || 0,
        // lowCount: scanResults.summary.count.low || 0,
        // resources: scanResults.summary.scanned_resource_count || 0,
        // SecurePercentage: calculateSecurePercentage(scanResults),
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

function calculateSecurePercentage(scanResults: any): number {
  const totalIssues =
    (scanResults.summary.critical_count || 0) +
    (scanResults.summary.high_count || 0) +
    (scanResults.summary.low_count || 0);
  const totalResources = scanResults.summary.scanned_resource_count || 0;

  if (totalResources === 0) return 100;
  return Math.round(((totalResources - totalIssues) / totalResources) * 100);
}
