interface CloudConfig {
  id: string;
  name: string;
  provider: string;
  criticalCount?: number;
  highCount?: number;
}

interface AppSidebarProps {
  initialConfigs: CloudConfig[];
}
