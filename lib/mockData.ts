export const cloudConfigs = {
  "aws-prod": {
    id: "aws-prod",
    name: "AWS Production",
    provider: "aws",
    criticalCount: 3,
    highCount: 7,
    lowCount: 12,
    resources: 124,
    securePercentage: 82,
    isPending: false,
    issues: [
      {
        id: "aws-issue-1",
        title: "S3 Bucket Publicly Accessible",
        description:
          "The S3 bucket 'company-data' is configured with public read access, exposing sensitive data.",
        severity: "critical",
        resource: "s3://company-data",
      },
      {
        id: "aws-issue-2",
        title: "IAM User with Admin Privileges",
        description:
          "User 'developer1' has been granted administrator privileges which violates least privilege principle.",
        severity: "critical",
        resource: "iam::user/developer1",
      },
      {
        id: "aws-issue-3",
        title: "Unencrypted Database",
        description:
          "RDS instance 'production-db' is not configured with encryption at rest.",
        severity: "high",
        resource: "rds:production-db",
      },
    ],
  },
  "azure-dev": {
    id: "azure-dev",
    name: "Azure Development",
    provider: "azure",
    criticalCount: 1,
    highCount: 4,
    lowCount: 8,
    resources: 78,
    securePercentage: 89,
    isPending: false,
    issues: [
      {
        id: "azure-issue-1",
        title: "Network Security Group Too Permissive",
        description:
          "NSG allows inbound traffic from any IP address on port 22 (SSH).",
        severity: "high",
        resource: "nsg:dev-servers",
      },
      {
        id: "azure-issue-2",
        title: "Storage Account with Public Access",
        description: "Storage account 'devfiles' allows public blob access.",
        severity: "critical",
        resource: "storage:devfiles",
      },
    ],
  },
  "gcp-staging": {
    id: "gcp-staging",
    name: "GCP Staging",
    provider: "gcp",
    criticalCount: 2,
    highCount: 5,
    lowCount: 9,
    resources: 92,
    securePercentage: 85,
    isPending: false,
    issues: [
      {
        id: "gcp-issue-1",
        title: "Missing Resource Tags",
        description:
          "Multiple resources are missing required organization tags for cost allocation.",
        severity: "low",
        resource: "multiple",
      },
      {
        id: "gcp-issue-2",
        title: "Default Service Account with Excessive Permissions",
        description:
          "Default service account has project editor role which grants excessive permissions.",
        severity: "critical",
        resource: "iam:default-service-account",
      },
    ],
  },
  // Add support for dynamically created configurations
  "aws-123": {
    id: "aws-123",
    name: "Production AWS",
    provider: "aws",
    criticalCount: 2,
    highCount: 4,
    lowCount: 7,
    resources: 86,
    securePercentage: 78,
    isPending: false,
    issues: [
      {
        id: "aws-123-issue-1",
        title: "Root Account Access Keys Active",
        description:
          "The root account has active access keys which is a security risk.",
        severity: "critical",
        resource: "iam::root",
      },
      {
        id: "aws-123-issue-2",
        title: "Security Groups Allow All Traffic",
        description:
          "Multiple security groups allow all inbound traffic on port 22.",
        severity: "high",
        resource: "sg:multiple",
      },
    ],
  },
  "azure-456": {
    id: "azure-456",
    name: "Development Azure",
    provider: "azure",
    criticalCount: 0,
    highCount: 1,
    lowCount: 3,
    resources: 42,
    securePercentage: 94,
    isPending: false,
    issues: [
      {
        id: "azure-456-issue-1",
        title: "Virtual Network Peering Not Secured",
        description:
          "Virtual network peering is not secured with proper gateway transit settings.",
        severity: "high",
        resource: "vnet:dev-network",
      },
    ],
  },
};
