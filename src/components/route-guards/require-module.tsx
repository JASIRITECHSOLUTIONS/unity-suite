import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type RequireModuleProps = {
  module: string;
  children: React.ReactNode;
};

export function RequireModule({ module, children }: RequireModuleProps) {
  const { hasModuleAccess, hasRole, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-6 w-48 bg-muted rounded" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const allowed = hasModuleAccess(module) || hasRole("super_admin");

  if (!allowed) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            You do not have permission to access the {module} module. Please contact your
            administrator if you believe this is a mistake.
          </AlertDescription>
          <div className="mt-4">
            <Button asChild>
              <a href="/dashboard">Go back to dashboard</a>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
