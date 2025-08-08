import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateInvoiceDialog } from '@/components/dialogs/CreateInvoiceDialog';
import { CreatePurchaseOrderDialog } from '@/components/dialogs/CreatePurchaseOrderDialog';
import { StockCheckDialog } from '@/components/dialogs/StockCheckDialog';
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog';
import { 
  Building2, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  CreditCard,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { profile, userRole, hasModuleAccess } = useAuth();

  const moduleStats = [
    {
      title: 'Finance',
      icon: DollarSign,
      value: '$24,350',
      change: '+12.5%',
      description: 'Monthly revenue',
      module: 'finance',
      trend: 'up'
    },
    {
      title: 'Procurement',
      icon: ShoppingCart,
      value: '47',
      change: '+8',
      description: 'Active requests',
      module: 'procurement',
      trend: 'up'
    },
    {
      title: 'Stores',
      icon: Package,
      value: '1,284',
      change: '-12',
      description: 'Items in stock',
      module: 'stores',
      trend: 'down'
    },
    {
      title: 'Employees',
      icon: Users,
      value: '156',
      change: '+4',
      description: 'Active employees',
      module: 'hrm',
      trend: 'up'
    },
    {
      title: 'Payroll',
      icon: CreditCard,
      value: '$89,450',
      change: '+2.1%',
      description: 'This month\'s payroll',
      module: 'payroll',
      trend: 'up'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'finance',
      title: 'New invoice generated',
      description: 'Invoice #INV-2024-001 created for $2,500',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'procurement',
      title: 'Purchase order approved',
      description: 'PO #PO-2024-015 approved by manager',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'stores',
      title: 'Low stock alert',
      description: 'Office supplies running low (12 items remaining)',
      time: '6 hours ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'hrm',
      title: 'New employee onboarded',
      description: 'John Smith added to Marketing department',
      time: '1 day ago',
      status: 'success'
    }
  ];

  const accessibleModules = moduleStats.filter(module => 
    hasModuleAccess(module.module)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name || 'User'}! Here's your enterprise overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {userRole?.role.replace('_', ' ').toUpperCase()}
          </Badge>
          {userRole?.organization_id && (
            <Badge variant="secondary">
              <Building2 className="w-3 h-3 mr-1" />
              Organization Member
            </Badge>
          )}
        </div>
      </div>

      {/* Module Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {accessibleModules.map((module) => (
          <Card key={module.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {module.title}
              </CardTitle>
              <module.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{module.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${
                  module.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {module.change}
                </span>
                {' '}from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {module.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions based on your permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {hasModuleAccess('finance') && <CreateInvoiceDialog />}
            {hasModuleAccess('procurement') && <CreatePurchaseOrderDialog />}
            {hasModuleAccess('stores') && <StockCheckDialog />}
            {hasModuleAccess('hrm') && <AddEmployeeDialog />}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your accessible modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current status of enterprise modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Authentication</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">File Storage</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Notifications</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* No Access Message */}
      {accessibleModules.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Limited Access</h3>
            <p className="text-muted-foreground">
              You don't have access to any modules yet. Please contact your administrator to get the necessary permissions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
