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
    createdAt: new Date("2023-10-01T12:00:00Z"),
    updatedAt: new Date("2023-10-10T12:00:00Z"),
    issues: [
      {
        id: "aws-issue-1",
        rule_id: "AVD-AWS-0001",
        long_id: "aws-s3-enable-bucket-encryption",
        rule_description: "S3 Bucket has encryption disabled",
        rule_provider: "aws",
        rule_service: "s3",
        impact: "The bucket objects could be read if compromised",
        resolution:
          "Enable encryption using customer managed keys or AWS managed keys",
        links: [
          "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html",
          "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket#server_side_encryption_configuration",
        ],
        title: "S3 Bucket Publicly Accessible",
        description:
          "The S3 bucket 'company-data' is configured with public read access, exposing sensitive data.",
        severity: "critical",
        resource: "s3://company-data",
        provider: "AWS",
        createdAt: "2023-10-01T12:00:00Z",
        updatedAt: "2023-10-02T12:00:00Z",
        location: {
          filename: "/terraform/s3.tf",
          start_line: 23,
          end_line: 25,
        },
      },
      {
        id: "aws-issue-2",
        rule_id: "AVD-AWS-0057",
        long_id: "aws-iam-no-user-attached-policies",
        rule_description: "IAM user has attached policies",
        rule_provider: "aws",
        rule_service: "iam",
        impact:
          "Attaching policies to users increases the chance of privilege escalation",
        resolution:
          "Attach policies at the group level instead of the user level",
        links: [
          "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#use-groups-for-permissions",
          "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user",
        ],
        title: "IAM User with Admin Privileges",
        description:
          "User 'developer1' has been granted administrator privileges which violates least privilege principle.",
        severity: "critical",
        resource: "iam::user/developer1",
        provider: "AWS",
        createdAt: "2023-10-03T12:00:00Z",
        updatedAt: "2023-10-04T12:00:00Z",
        location: {
          filename: "/terraform/iam.tf",
          start_line: 45,
          end_line: 52,
        },
      },
      {
        id: "aws-issue-3",
        rule_id: "AVD-AWS-0089",
        long_id: "aws-rds-encrypt-instance-storage-data",
        rule_description:
          "RDS encryption has not been enabled at a DB Instance level",
        rule_provider: "aws",
        rule_service: "rds",
        impact: "Data can be read from the RDS instance if compromised",
        resolution: "Enable encryption for RDS instances",
        links: [
          "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html",
          "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_instance#storage_encrypted",
        ],
        title: "Unencrypted Database",
        description:
          "RDS instance 'production-db' is not configured with encryption at rest.",
        severity: "high",
        resource: "rds:production-db",
        provider: "AWS",
        createdAt: "2023-10-05T12:00:00Z",
        updatedAt: "2023-10-06T12:00:00Z",
        location: {
          filename: "/terraform/rds.tf",
          start_line: 10,
          end_line: 15,
        },
      },
      {
        id: "aws-issue-4",
        rule_id: "AVD-AWS-0097",
        long_id: "aws-sqs-no-wildcards-in-policy-documents",
        rule_description:
          "AWS SQS policy document has wildcard action statement.",
        rule_provider: "aws",
        rule_service: "sqs",
        impact:
          "SQS policies with wildcard actions allow more that is required",
        resolution:
          "Keep policy scope to the minimum that is required to be effective",
        links: [
          "https://aquasecurity.github.io/tfsec/v1.28.13/checks/aws/sqs/no-wildcards-in-policy-documents/",
          "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue_policy",
        ],
        description: "Queue policy does not restrict actions to a known set.",
        severity: "high",
        warning: false,
        status: 0,
        resource: "aws_sqs_queue.tfer--noter",
        provider: "AWS",
        title: "SQS Queue with Wildcard Policy",
        createdAt: "2023-10-07T12:00:00Z",
        updatedAt: "2023-10-08T12:00:00Z",
        location: {
          filename:
            "/home/lalit/Projects/terraTest3/generated/aws/sqs/sqs_queue.tf",
          start_line: 15,
          end_line: 15,
        },
      },
    ],
  },
  // Other cloud configs remain the same...
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
    createdAt: new Date("2023-10-01T12:00:00Z"),
    updatedAt: new Date("2023-10-10T12:00:00Z"),
    issues: [
      {
        id: "azure-issue-1",
        rule_id: "AVD-AZR-0012",
        long_id: "azure-network-no-public-ingress",
        rule_description: "Network security rule allows public ingress",
        rule_provider: "azure",
        rule_service: "network",
        impact:
          "Publicly accessible ports could expose the network to unauthorized access",
        resolution: "Restrict access to specific IP addresses or ranges",
        links: [
          "https://docs.microsoft.com/en-us/azure/security/fundamentals/network-best-practices",
          "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_security_rule",
        ],
        title: "Network Security Group Too Permissive",
        description:
          "NSG allows inbound traffic from any IP address on port 22 (SSH).",
        severity: "high",
        resource: "nsg:dev-servers",
        provider: "Azure",
        createdAt: "2023-10-07T12:00:00Z",
        updatedAt: "2023-10-08T12:00:00Z",
        location: {
          filename: "/terraform/network.tf",
          start_line: 30,
          end_line: 42,
        },
      },
      {
        id: "azure-issue-2",
        rule_id: "AVD-AZR-0045",
        long_id: "azure-storage-default-action-deny",
        rule_description:
          "Storage accounts should have the default network access rule set to deny",
        rule_provider: "azure",
        rule_service: "storage",
        impact: "Unrestricted network access to storage account",
        resolution:
          "Set default action to deny and explicitly allow required networks",
        links: [
          "https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security",
          "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account_network_rules",
        ],
        title: "Storage Account with Public Access",
        description: "Storage account 'devfiles' allows public blob access.",
        severity: "critical",
        resource: "storage:devfiles",
        provider: "Azure",
        createdAt: "2023-10-07T12:00:00Z",
        updatedAt: "2023-10-08T12:00:00Z",
        location: {
          filename: "/terraform/storage.tf",
          start_line: 15,
          end_line: 20,
        },
      },
    ],
  },
  // Other cloud configs remain the same...
};
