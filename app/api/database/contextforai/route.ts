import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const issueId = request.nextUrl.searchParams.get("issueId");

  if (!issueId) {
    return NextResponse.json(
      { error: "Issue ID is required" },
      { status: 400 },
    );
  }

  try {
    const issue = await prisma.securityIssue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      return NextResponse.json(
        { error: "Security issue not found" },
        { status: 404 },
      );
    }

    const contextString = `
      Rule ID: ${issue.rule_id || "N/A"}
      Long ID: ${issue.long_id || "N/A"}
      Rule Description: ${issue.rule_description || "N/A"}
      Rule Provider: ${issue.rule_provider || "N/A"}
      Rule Service: ${issue.rule_service || "N/A"}
      Impact: ${issue.impact || "N/A"}
      Resolution: ${issue.resolution || "N/A"}
      Links: ${issue.links.join(", ") || "N/A"}
      Description: ${issue.description}
      Severity: ${issue.severity}
      Warning: ${issue.warning ? "Yes" : "No"}
      Status: ${issue.status !== null ? issue.status.toString() : "N/A"}
      Resource: ${issue.resource}
      Location: ${JSON.stringify(issue.location) || "N/A"}
    `.trim();

    return NextResponse.json({ context: contextString });
  } catch (error) {
    console.error("Error fetching context for AI:", error);
    return NextResponse.json(
      { error: "Failed to fetch context for AI" },
      { status: 500 },
    );
  }
}
