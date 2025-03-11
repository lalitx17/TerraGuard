export default function generateTerraformConfig(
  provider: string,
  region: string,
): string {
  // AWS configuration
  if (provider === "aws") {
    return `
    terraform {
      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = "~> 5.0"
        }
      }
    }

    provider "aws" {
      region = "${region}"
    }
`;
  }

  // Azure configuration
  if (provider === "azure") {
    return `
provider "azurerm" {
  features {}
}

data "azurerm_subscription" "current" {}
data "azurerm_client_config" "current" {}

output "account_info" {
  value = {
    subscription_id = data.azurerm_subscription.current.subscription_id
    tenant_id       = data.azurerm_client_config.current.tenant_id
    client_id       = data.azurerm_client_config.current.client_id
  }
}
`;
  }

  // GCP configuration
  if (provider === "google") {
    return `
provider "google" {
  # Provider-specific configuration
}

data "google_client_config" "current" {}
data "google_project" "current" {}

output "account_info" {
  value = {
    project     = data.google_project.current.project_id
    region      = data.google_client_config.current.region
    credentials = data.google_client_config.current.access_token
  }
}
`;
  }

  // Default fallback for unsupported providers
  return `
provider "${provider}" {
  # Provider-specific configuration
}

output "provider_info" {
  value = "Configuration for ${provider} is not fully supported yet"
}
`;
}
