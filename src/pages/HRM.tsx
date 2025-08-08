import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  Clock, 
  Award,
  UserPlus,
  Search,
  Filter,
  Plus,
  FileText,
  TrendingUp,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

export default function HRM() {
  const hrmMetrics = [
    {
      title: "Total Employees",
      value: "147",
      change: "+5 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending Leave Requests",
      value: "12",
      change: "3 urgent",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Open Positions",
      value: "8",
      change: "+2 new postings",
      icon: UserPlus,
      color: "text-green-600"
    },
    {
      title: "Performance Reviews Due",
      value: "23",
      change: "This quarter",
      icon: Award,
      color: "text-purple-600"
    }
  ];

  const recentEmployees = [
    {
      id: "EMP-001",
      name: "John Doe",
      position: "Software Engineer",
      department: "Engineering",
      email: "john.doe@company.com",
      phone: "+254 712 345 678",
      avatar: "/placeholder.svg",
      status: "active",
      joinDate: "2024-01-15"
    },
    {
      id: "EMP-002", 
      name: "Jane Smith",
      position: "Marketing Manager",
      department: "Marketing",
      email: "jane.smith@company.com",
      phone: "+254 723 456 789",
      avatar: "/placeholder.svg",
      status: "active",
      joinDate: "2023-11-20"
    },
    {
      id: "EMP-003",
      name: "Mike Johnson",
      position: "Financial Analyst",
      department: "Finance",
      email: "mike.johnson@company.com", 
      phone: "+254 734 567 890",
      avatar: "/placeholder.svg",
      status: "on_leave",
      joinDate: "2023-08-12"
    },
    {
      id: "EMP-004",
      name: "Sarah Wilson",
      position: "HR Specialist",
      department: "Human Resources",
      email: "sarah.wilson@company.com",
      phone: "+254 745 678 901",
      avatar: "/placeholder.svg",
      status: "active",
      joinDate: "2023-06-05"
    }
  ];

  const leaveRequests = [
    {
      id: "LR-001",
      employee: "John Doe",
      type: "Annual Leave",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      days: 5,
      status: "pending",
      reason: "Family vacation"
    },
    {
      id: "LR-002",
      employee: "Jane Smith", 
      type: "Sick Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      days: 3,
      status: "approved",
      reason: "Medical appointment"
    },
    {
      id: "LR-003",
      employee: "Mike Johnson",
      type: "Personal Leave",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      days: 2,
      status: "pending",
      reason: "Personal matters"
    }
  ];

  const departments = [
    { name: "Engineering", employees: 45, budget: "KES 2.5M", head: "Alice Cooper" },
    { name: "Marketing", employees: 18, budget: "KES 800K", head: "Bob Miller" },
    { name: "Finance", employees: 12, budget: "KES 600K", head: "Carol Davis" },
    { name: "Human Resources", employees: 8, budget: "KES 400K", head: "David Brown" },
    { name: "Operations", employees: 25, budget: "KES 1.2M", head: "Eva Green" }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      on_leave: { variant: "secondary" as const, label: "On Leave" },
      inactive: { variant: "destructive" as const, label: "Inactive" },
      pending: { variant: "outline" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-muted-foreground">
            Manage employees, leave requests, and HR operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* HRM Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hrmMetrics.map((metric, index) => (
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

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>
                    Manage and view all employees
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search employees..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{employee.name}</p>
                          <Badge variant="outline" className="text-xs">{employee.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {employee.phone}
                        </div>
                      </div>
                      {getStatusBadge(employee.status)}
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Requests
              </CardTitle>
              <CardDescription>
                Review and manage employee leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{request.employee}</p>
                          <p className="text-sm text-muted-foreground">{request.type}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {request.startDate} - {request.endDate}
                        </p>
                        <p className="text-xs text-muted-foreground">{request.days} days</p>
                      </div>
                      {getStatusBadge(request.status)}
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reject
                          </Button>
                          <Button size="sm">
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Department Overview
              </CardTitle>
              <CardDescription>
                View department structure and budgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {departments.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{dept.name}</h3>
                      <Badge variant="secondary">{dept.employees} employees</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Budget: {dept.budget}</p>
                      <p>Department Head: {dept.head}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Recruitment & Hiring
              </CardTitle>
              <CardDescription>
                Manage job postings and candidate pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Recruitment management tools will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Reviews
                </CardTitle>
                <CardDescription>
                  Track employee performance and reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Performance review system will be implemented here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Employee Analytics
                </CardTitle>
                <CardDescription>
                  View workforce analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Employee analytics dashboard will be implemented here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
