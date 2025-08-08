import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CreatePayrollRunDialog from "@/components/dialogs/CreatePayrollRunDialog";
import { listPayrollRuns, exportRunToCSV, PayrollRun } from "@/services/payroll";
import { useAuth } from "@/hooks/useAuth";
import { Download, Eye } from 'lucide-react';

export default function Payroll() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: runs, isLoading, error } = useQuery({
    queryKey: ["payroll-runs", userRole?.organization_id ?? "none"],
    queryFn: () => listPayrollRuns({ orgId: userRole?.organization_id ?? null }),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payroll</h1>
        <CreatePayrollRunDialog
          onCreated={() => queryClient.invalidateQueries({ queryKey: ["payroll-runs"] })}
          trigger={<Button size="sm">New Payroll Run</Button>}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Runs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse h-10 w-full bg-muted rounded" />
          ) : error ? (
            <p className="text-sm text-destructive">{(error as Error).message}</p>
          ) : !runs || runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payroll runs yet. Create your first run.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run: PayrollRun) => (
                  <TableRow key={run.id}>
                    <TableCell>{run.period_start} → {run.period_end}</TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant(run.status)}>{run.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{fmt(run.gross_pay)}</TableCell>
                    <TableCell className="text-right">{fmt(run.total_allowances)}</TableCell>
                    <TableCell className="text-right">{fmt(run.total_deductions)}</TableCell>
                    <TableCell className="text-right">{fmt(run.total_tax)}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(run.net_pay)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => navigate(`/payroll/${run.id}`)} aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => exportRunToCSV(run, [])} aria-label="Export CSV" title="Exports empty items if run not loaded">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function badgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "draft":
      return "secondary";
    case "processing":
      return "default";
    case "completed":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

function fmt(v?: number | null) {
  const n = Number(v ?? 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
