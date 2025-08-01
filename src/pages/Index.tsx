import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Shield, Zap, Globe, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Building2,
      title: "Multi-Organization Support",
      description: "Manage multiple organizations with flexible role-based access control and custom configurations."
    },
    {
      icon: Users,
      title: "Role-Based Access Control", 
      description: "Granular permissions system with super admin, admin, manager, employee, and viewer roles."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built with security-first approach including RLS policies and audit trails."
    },
    {
      icon: Zap,
      title: "Modular Architecture",
      description: "Scalable modular design supporting Finance, Procurement, HRM, Stores, and more."
    },
    {
      icon: Globe,
      title: "Real-time Collaboration",
      description: "Real-time updates, notifications, and workflow management across teams."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Unity Suite</span>
          </div>
          <Button asChild>
            <a href="/auth">Get Started</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Scalable Enterprise
            <span className="text-primary"> Management System</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A modular, role-based enterprise system that adapts to any industry, company size, 
            or specific requirements. Built for Finance, Procurement, HR, Stores & Logistics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <a href="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need for enterprise management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive modules designed for modern business operations
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to transform your business?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Join enterprises worldwide who trust Unity Suite for their critical business operations.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <a href="/auth">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Unity Suite. Built with scalability and security in mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
