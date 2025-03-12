interface CloudConfig {
  id: string;
  name: string;
  provider: string;
  criticalCount?: number;
  highCount?: number;
  lowCount?: number;
  resources?: number;
  securePercentage?: number;
  issues?: Issue[];
  isPending?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: string;
  resource: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface AppSidebarProps {
  initialConfigs: CloudConfig[];
}
