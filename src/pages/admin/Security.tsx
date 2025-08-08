import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const modules = ["finance", "procurement", "stores", "hrm", "payroll"] as const;

export default function AdminSecurity() {
  const { userRole, hasRole, hasModuleAccess } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">Your current access and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role</CardTitle>
          <CardDescription>Highest effective role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge>{userRole?.role.replace('_',' ').toUpperCase() || 'N/A'}</Badge>
            {userRole?.organization_id && <Badge variant="secondary">Org-scoped</Badge>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Module Access</CardTitle>
          <CardDescription>Modules you can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {modules.map(m => (
              <Badge key={m} variant={hasModuleAccess(m) ? 'default' : 'outline'}>
                {m}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
