import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Plus,
  Filter,
  FileText,
  Truck,
  Users
} from 'lucide-react';

export default function Procurement() {
  const procurementMetrics = [
    {
      title: "Active Purchase Orders",
      value: "24",
      change: "+3 this week",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Pending Approvals",
      value: "8",
      change: "2 urgent",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Total Suppliers",
      value: "156",
      change: "+12 this month",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Monthly Spend",
      value: "KES 1.2M",
      change: "+8.5% vs last month",
      icon: ShoppingCart,
      color: "text-purple-600"
    }
  ];

  const recentPurchaseOrders = [
    { 
      id: "PO-2024-001", 
      supplier: "Office Solutions Ltd", 
      amount: "KES 45,000", 
      status: "pending_approval",
      date: "2024-01-15",
      items: "Office Supplies & Stationery"
    },
    { 
      id: "PO-2024-002", 
      supplier: "Tech Equipment Co", 
      amount: "KES 120,000", 
      status: "approved",
      date: "2024-01-14",
      items: "Laptops & Accessories"
    },
    { 
      id: "PO-2024-003", 
      supplier: "Facility Services", 
      amount: "KES 18,500", 
      status: "delivered",
      date: "2024-01-13",
      items: "Cleaning Supplies"
    },
    { 
      id: "PO-2024-004", 
      supplier: "Maintenance Plus", 
      amount: "KES 85,000", 
      status: "in_transit",
      date: "2024-01-12",
      items: "HVAC Equipment"
    },
  ];

  const topSuppliers = [
    { name: "Tech Equipment Co", orders: 15, amount: "KES 450,000", rating: 4.8 },
    { name: "Office Solutions Ltd", orders: 12, amount: "KES 280,000", rating: 4.6 },
    { name: "Facility Services", orders: 8, amount: "KES 180,000", rating: 4.5 },
    { name: "Industrial Supply", orders: 6, amount: "KES 320,000", rating: 4.7 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_approval: { variant: "secondary" as const, label: "Pending Approval" },
      approved: { variant: "default" as const, label: "Approved" },
      in_transit: { variant: "outline" as const, label: "In Transit" },
      delivered: { variant: "default" as const, label: "Delivered" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_approval;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procurement</h1>
          <p className="text-muted-foreground">
            Manage purchase orders, suppliers, and procurement workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Procurement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {procurementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Manage and track all purchase orders
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search orders..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPurchaseOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.supplier}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{order.items}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      {getStatusBadge(order.status)}
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Supplier Management
              </CardTitle>
              <CardDescription>
                View and manage supplier relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {supplier.orders} orders • Rating: {supplier.rating}/5.0
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{supplier.amount}</p>
                      <p className="text-xs text-muted-foreground">Total spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>
                Review and approve purchase requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPurchaseOrders
                  .filter(order => order.status === 'pending_approval')
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.supplier}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{order.items}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{order.amount}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {recentPurchaseOrders.filter(order => order.status === 'pending_approval').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pending approvals at this time
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending Analysis</CardTitle>
                <CardDescription>
                  Monthly procurement spending trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Spending analytics and charts will be implemented here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>
                  Track supplier delivery and quality metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Supplier performance metrics will be implemented here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
