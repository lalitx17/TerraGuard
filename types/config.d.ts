import { Prisma } from "@prisma/client";

export type CloudConfig = Prisma.ConfigurationGetPayload<{
  include: { issues: true };
}>;

export type SecurityIssue = Prisma.SecurityIssueGetPayload<{}>;

export type Configuration = Prisma.ConfigurationGetPayload<{
  include: {
    issues: true;
  };
}>;

interface AppSidebarProps {
  initialConfigs: CloudConfig[];
}
