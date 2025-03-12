interface CloudConfig {
  id: string;
  name: string;
  provider: string;
  criticalCount?: number;
  highCount?: number;
  lowCount?: number;
  resources?: number;
  securePercentage?: number;
  issues?: any[];
  pending?: boolean;
}

interface AppSidebarProps {
  initialConfigs: CloudConfig[];
}
