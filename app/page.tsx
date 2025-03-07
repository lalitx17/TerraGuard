import { AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Container } from "@/components/ui/container"

export default function Home() {
  return (
    <div className="w-full py-6">
      <Container>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Home</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Across all cloud configurations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Severity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">Across all cloud configurations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Severity</CardTitle>
              <ShieldCheck className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">29</div>
              <p className="text-xs text-muted-foreground">Across all cloud configurations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secure Resources</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <Progress value={87} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="high">High</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Issues Summary</CardTitle>
                <CardDescription>Overview of all security issues across your cloud configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {securityIssues.map((issue) => (
                      <div key={issue.id} className="flex items-start gap-4 rounded-lg border p-4">
                        {issue.severity === "critical" ? (
                          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                        ) : issue.severity === "high" ? (
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                        ) : (
                          <ShieldCheck className="mt-0.5 h-5 w-5 text-yellow-500" />
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="font-medium leading-none">{issue.title}</p>
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground">{issue.resource}</span>
                            <span className="mx-2 text-xs text-muted-foreground">•</span>
                            <span className="text-xs font-medium">{issue.provider}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="critical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Security Issues</CardTitle>
                <CardDescription>Issues that require immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {securityIssues
                      .filter((issue) => issue.severity === "critical")
                      .map((issue) => (
                        <div key={issue.id} className="flex items-start gap-4 rounded-lg border p-4">
                          <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">{issue.title}</p>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">{issue.resource}</span>
                              <span className="mx-2 text-xs text-muted-foreground">•</span>
                              <span className="text-xs font-medium">{issue.provider}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="high" className="space-y-4">
            {/* Similar content for high severity issues */}
          </TabsContent>
          <TabsContent value="low" className="space-y-4">
            {/* Similar content for low severity issues */}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  )
}

const securityIssues = [
  {
    id: "issue-1",
    title: "S3 Bucket Publicly Accessible",
    description: "The S3 bucket 'company-data' is configured with public read access, exposing sensitive data.",
    severity: "critical",
    resource: "s3://company-data",
    provider: "AWS",
  },
  {
    id: "issue-2",
    title: "IAM User with Admin Privileges",
    description:
      "User 'developer1' has been granted administrator privileges which violates least privilege principle.",
    severity: "critical",
    resource: "iam::user/developer1",
    provider: "AWS",
  },
  {
    id: "issue-3",
    title: "Unencrypted Database",
    description: "RDS instance 'production-db' is not configured with encryption at rest.",
    severity: "high",
    resource: "rds:production-db",
    provider: "AWS",
  },
  {
    id: "issue-4",
    title: "Network Security Group Too Permissive",
    description: "NSG allows inbound traffic from any IP address on port 22 (SSH).",
    severity: "high",
    resource: "nsg:dev-servers",
    provider: "Azure",
  },
  {
    id: "issue-5",
    title: "Missing Resource Tags",
    description: "Multiple resources are missing required organization tags for cost allocation.",
    severity: "low",
    resource: "multiple",
    provider: "GCP",
  },
]

