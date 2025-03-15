import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

interface CodeLocation {
  filename?: string;
  start_line?: number;
  end_line?: number;
}

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

    let fullFileContent = "";
    let relevantSnippet = "";

    if (issue.location && typeof issue.location === "object") {
      const location = issue.location as CodeLocation;
      const filePath = location.filename;

      if (filePath && typeof filePath === "string") {
        try {
          fullFileContent = await fs.readFile(path.resolve(filePath), "utf8");

          if (
            typeof location.start_line === "number" &&
            typeof location.end_line === "number"
          ) {
            const lines = fullFileContent.split("\n");
            const startLine = Math.max(0, location.start_line - 1);
            const endLine = Math.min(lines.length, location.end_line);
            relevantSnippet = lines.slice(startLine, endLine).join("\n");
          }
        } catch (error) {
          console.error(`Error reading file at ${filePath}:`, error);
          fullFileContent = "Unable to read file content";
          relevantSnippet = "Unable to extract code snippet";
        }
      }
    }

    const contextString = `
      ## Security Issue Details
      Rule ID: ${issue.rule_id || "N/A"}
      Long ID: ${issue.long_id || "N/A"}
      Description: ${issue.description}
      Severity: ${issue.severity}
      Status: ${issue.status !== null ? issue.status.toString() : "N/A"}

      ## Rule Information
      Provider: ${issue.rule_provider || "N/A"}
      Service: ${issue.rule_service || "N/A"}
      Impact: ${issue.impact || "N/A"}
      Resolution: ${issue.resolution || "N/A"}
      Documentation: ${issue.links.join(", ") || "N/A"}

      ## Resource Context
      Affected Resource: ${issue.resource}
      File Location: ${(issue.location as CodeLocation)?.filename || "N/A"}
      Warning: ${issue.warning ? "Yes" : "No"}

      ## Code Context
      ${relevantSnippet ? `Relevant Code Snippet (Lines ${(issue.location as CodeLocation)?.start_line}-${(issue.location as CodeLocation)?.end_line}):\n${relevantSnippet}` : ""}

      ## Full File Content
      ${fullFileContent}
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
