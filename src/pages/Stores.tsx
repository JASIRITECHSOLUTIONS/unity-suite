import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Warehouse, 
  Truck, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Plus,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function Stores() {
  const storesMetrics = [
    {
      title: "Total Items",
      value: "2,847",
      change: "+127 this month",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "Needs attention",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      title: "Active Shipments",
      value: "15",
      change: "3 arriving today",
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Warehouse Locations",
      value: "4",
      change: "98% capacity",
      icon: Warehouse,
      color: "text-purple-600"
    }
  ];

  const inventoryItems = [
    {
      id: "ITM-001",
      name: "Office Chairs - Executive",
      category: "Furniture",
      sku: "OFF-CHR-001",
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      unit: "pieces",
      location: "Warehouse A-2",
      value: "KES 135,000",
      status: "in_stock"
    },
    {
      id: "ITM-002",
      name: "Laptop - Dell Latitude 5520",
      category: "Electronics",
      sku: "ELC-LAP-002",
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: "pieces",
      location: "Warehouse B-1",
      value: "KES 640,000",
      status: "low_stock"
    },
    {
      id: "ITM-003",
      name: "A4 Paper - Premium",
      category: "Stationery",
      sku: "STA-PAP-003",
      currentStock: 156,
      minStock: 50,
      maxStock: 200,
      unit: "reams",
      location: "Warehouse A-1",
      value: "KES 78,000",
      status: "in_stock"
    },
    {
      id: "ITM-004",
      name: "Printer Toner - HP LaserJet",
      category: "Consumables",
      sku: "CON-TON-004",
      currentStock: 3,
      minStock: 10,
      maxStock: 30,
      unit: "cartridges",
      location: "Warehouse B-2",
      value: "KES 24,000",
      status: "critical"
    }
  ];

  const recentMovements = [
    {
      id: "MOV-001",
      item: "Office Chairs - Executive",
      type: "receipt",
      quantity: 25,
      date: "2024-01-15",
      reference: "PO-2024-001",
      location: "Warehouse A-2"
    },
    {
      id: "MOV-002",
      item: "Laptop - Dell Latitude 5520",
      type: "issue",
      quantity: 3,
      date: "2024-01-14",
      reference: "REQ-2024-045",
      location: "Warehouse B-1"
    },
    {
      id: "MOV-003",
      item: "A4 Paper - Premium",
      type: "receipt",
      quantity: 100,
      date: "2024-01-13",
      reference: "PO-2024-002",
      location: "Warehouse A-1"
    },
    {
      id: "MOV-004",
      item: "Printer Toner - HP LaserJet",
      type: "issue",
      quantity: 5,
      date: "2024-01-12",
      reference: "REQ-2024-046",
      location: "Warehouse B-2"
    }
  ];

  const shipments = [
    {
      id: "SHP-001",
      supplier: "Office Solutions Ltd",
      items: "Office Furniture & Accessories",
      status: "in_transit",
      expectedDate: "2024-01-16",
      trackingNumber: "OS-2024-156789",
      value: "KES 85,000"
    },
    {
      id: "SHP-002",
      supplier: "Tech Equipment Co",
      items: "Laptops & IT Equipment",
      status: "delivered",
      expectedDate: "2024-01-14",
      trackingNumber: "TE-2024-234567",
      value: "KES 320,000"
    },
    {
      id: "SHP-003",
      supplier: "Stationery Plus",
      items: "Office Supplies",
      status: "pending",
      expectedDate: "2024-01-18",
      trackingNumber: "SP-2024-345678",
      value: "KES 45,000"
    }
  ];

  const warehouses = [
    { name: "Warehouse A", location: "Nairobi Main", capacity: 85, items: 1200, zones: 4 },
    { name: "Warehouse B", location: "Mombasa Branch", capacity: 72, items: 850, zones: 3 },
    { name: "Warehouse C", location: "Kisumu Hub", capacity: 95, items: 650, zones: 2 },
    { name: "Warehouse D", location: "Nakuru Store", capacity: 60, items: 400, zones: 2 }
  ];

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current <= min) return { status: "critical", color: "text-red-600", bg: "bg-red-100" };
    if (current <= min * 1.5) return { status: "low_stock", color: "text-orange-600", bg: "bg-orange-100" };
    return { status: "in_stock", color: "text-green-600", bg: "bg-green-100" };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_stock: { variant: "default" as const, label: "In Stock" },
      low_stock: { variant: "secondary" as const, label: "Low Stock" },
      critical: { variant: "destructive" as const, label: "Critical" },
      out_of_stock: { variant: "destructive" as const, label: "Out of Stock" },
      in_transit: { variant: "outline" as const, label: "In Transit" },
      delivered: { variant: "default" as const, label: "Delivered" },
      pending: { variant: "secondary" as const, label: "Pending" },
      receipt: { variant: "default" as const, label: "Receipt" },
      issue: { variant: "secondary" as const, label: "Issue" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getMovementIcon = (type: string) => {
    return type === 'receipt' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores & Logistics</h1>
          <p className="text-muted-foreground">
            Manage inventory, warehouses, and supply chain operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stores Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {storesMetrics.map((metric, index) => (
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

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Track and manage all inventory items
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search items..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems.map((item) => {
                  const stockInfo = getStockStatus(item.currentStock, item.minStock, item.maxStock);
                  const stockPercentage = (item.currentStock / item.maxStock) * 100;

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.category} • SKU: {item.sku}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{item.location}</span>
                          </div>
                          <div className="flex-1 max-w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{item.currentStock}</span>
                              <span>{item.maxStock}</span>
                            </div>
                            <Progress value={stockPercentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{item.value}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.currentStock} {item.unit}
                          </p>
                        </div>
                        {getStatusBadge(stockInfo.status)}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stock Movements
              </CardTitle>
              <CardDescription>
                Track all inventory receipts and issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getMovementIcon(movement.type)}
                      <div>
                        <p className="font-medium">{movement.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Ref: {movement.reference}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {movement.type === 'receipt' ? '+' : '-'}{movement.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">{movement.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{movement.location}</span>
                        </div>
                      </div>
                      {getStatusBadge(movement.type)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipment Tracking
              </CardTitle>
              <CardDescription>
                Monitor incoming and outgoing shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{shipment.supplier}</p>
                          <p className="text-sm text-muted-foreground">{shipment.items}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tracking: {shipment.trackingNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{shipment.value}</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{shipment.expectedDate}</span>
                        </div>
                      </div>
                      {getStatusBadge(shipment.status)}
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Warehouse Management
              </CardTitle>
              <CardDescription>
                Monitor warehouse capacity and operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {warehouses.map((warehouse, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{warehouse.name}</h3>
                        <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                      </div>
                      <Badge variant="secondary">{warehouse.zones} zones</Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Capacity</span>
                          <span>{warehouse.capacity}%</span>
                        </div>
                        <Progress value={warehouse.capacity} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Items stored:</span>
                        <span>{warehouse.items}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Valuation</CardTitle>
                <CardDescription>
                  Current value and trends of inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Inventory valuation reports will be implemented here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Analysis</CardTitle>
                <CardDescription>
                  Analyze patterns in stock movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Stock movement analytics will be implemented here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}