interface CloudConfig {
  id: string;
  name: string;
  provider: string;
  criticalCount?: number;
  highCount?: number;
  lowCount?: number;
  resources?: number;
  securePercentage?: number;
  issues?: SecurityIssue[];
  isPending?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SecurityIssue {
  id: string;
  rule_id?: string;
  long_id?: string;
  rule_description?: string;
  rule_provider?: string;
  rule_service?: string;
  impact?: string;
  resolution?: string;
  links?: string[];
  description: string;
  severity: string;
  warning?: boolean;
  status?: number;
  resource: string;
  provider?: string;
  title?: string;
  location?: {
    filename?: string;
    start_line?: number;
    end_line?: number;
  };
}

interface AppSidebarProps {
  initialConfigs: CloudConfig[];
}
