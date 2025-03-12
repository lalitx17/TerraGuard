interface CloudConfig {
  id: string;
  name: string;
  provider: string;
  pending: boolean;
  criticalCount?: number;
  highCount?: number;
}

interface AppSidebarProps {
  initialConfigs: CloudConfig[];
}
