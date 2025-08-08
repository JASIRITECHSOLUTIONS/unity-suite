import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  addEmployeeToRun,
  finalizePayrollRun,
  getPayrollRun,
  removeItemFromRun,
  exportRunToCSV,
  PayrollRun,
  PayrollRunItem,
} from "@/services/payroll";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, Download, Trash } from 'lucide-react';

type Emp = { id: string; employee_id: string; first_name: string; last_name: string };

export default function PayrollRunDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userRole } = useAuth();

  const runQuery = useQuery({
    queryKey: ["payroll-run", id],
    queryFn: () => getPayrollRun(id!),
    enabled: !!id,
  });

  const employeesQuery = useQuery({
    queryKey: ["employees", userRole?.organization_id ?? "none"],
    queryFn: async () => {
      let q = supabase.from("employees").select("id,employee_id,first_name,last_name").order("first_name", { ascending: true });
      if (userRole?.organization_id) q = q.eq("organization_id", userRole.organization_id);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Emp[];
    },
  });

  const addMutation = useMutation({
    mutationFn: (payload: {
      employeeId: string;
      basicPay: number;
      allowances: number;
      deductions: number;
    }) => addEmployeeToRun({
      runId: id!,
      employeeId: payload.employeeId,
      employeeName: employeeNameById(payload.employeeId),
      basicPay: payload.basicPay,
      allowances: payload.allowances,
      deductions: payload.deductions,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-run", id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeItemFromRun(itemId, id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-run", id] });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: () => finalizePayrollRun(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-run", id] });
    },
  });

  const employeeNameById = (empId: string) => {
    const emp = employeesQuery.data?.find((e) => e.id === empId);
    if (!emp) return null;
    return `${emp.first_name} ${emp.last_name}`.trim();
  };

  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [basicPay, setBasicPay] = useState<string>("0");
  const [allowances, setAllowances] = useState<string>("0");
  const [deductions, setDeductions] = useState<string>("0");

  const totals = useMemo(() => {
    const run = runQuery.data?.run;
    return {
      gross: run?.gross_pay ?? 0,
      allowances: run?.total_allowances ?? 0,
      deductions: run?.total_deductions ?? 0,
      tax: run?.total_tax ?? 0,
      net: run?.net_pay ?? 0,
    };
  }, [runQuery.data]);

  const items = runQuery.data?.items ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/payroll")} className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (runQuery.data) exportRunToCSV(runQuery.data.run, runQuery.data.items);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => finalizeMutation.mutate()} disabled={finalizeMutation.isPending || runQuery.data?.run.status === "completed"}>
            <Check className="h-4 w-4 mr-2" />
            {finalizeMutation.isPending ? "Finalizing..." : "Finalize Run"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {runQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="animate-pulse h-16 bg-muted rounded" />
              <div className="animate-pulse h-16 bg-muted rounded" />
              <div className="animate-pulse h-16 bg-muted rounded" />
            </div>
          ) : runQuery.error ? (
            <p className="text-sm text-destructive">{(runQuery.error as Error).message}</p>
          ) : runQuery.data ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <SummaryTile label="Period" value={`${runQuery.data.run.period_start} → ${runQuery.data.run.period_end}`} />
              <SummaryTile label="Status" value={runQuery.data.run.status} />
              <SummaryTile label="Gross" value={fmt(totals.gross)} />
              <SummaryTile label="Tax" value={fmt(totals.tax)} />
              <SummaryTile label="Net" value={fmt(totals.net)} />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employees in this Run</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add employee to run */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2">
              <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employeesQuery.data?.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{`${e.employee_id} — ${e.first_name} ${e.last_name}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input type="number" value={basicPay} onChange={(e) => setBasicPay(e.target.value)} placeholder="Basic Pay" />
            </div>
            <div>
              <Input type="number" value={allowances} onChange={(e) => setAllowances(e.target.value)} placeholder="Allowances" />
            </div>
            <div>
              <Input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} placeholder="Deductions" />
            </div>
            <div>
              <Button
                onClick={() =>
                  addMutation.mutate({
                    employeeId: selectedEmpId,
                    basicPay: Number(basicPay || 0),
                    allowances: Number(allowances || 0),
                    deductions: Number(deductions || 0),
                  })
                }
                disabled={!selectedEmpId || addMutation.isPending}
              >
                {addMutation.isPending ? "Adding..." : "Add Employee"}
              </Button>
            </div>
          </div>

          {/* Items table */}
          {runQuery.isLoading ? (
            <div className="animate-pulse h-20 bg-muted rounded" />
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No employees added yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Basic</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it: PayrollRunItem) => (
                  <TableRow key={it.id}>
                    <TableCell>{it.employee_id} — {it.employee_name ?? "—"}</TableCell>
                    <TableCell className="text-right">{fmt(it.basic_pay)}</TableCell>
                    <TableCell className="text-right">{fmt(it.allowances)}</TableCell>
                    <TableCell className="text-right">{fmt(it.deductions)}</TableCell>
                    <TableCell className="text-right">{fmt(it.tax)}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(it.net_pay)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeMutation.mutate(it.id)}
                        aria-label="Remove"
                        title="Remove from run"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals footer row */}
                {runQuery.data && (
                  <TableRow>
                    <TableCell className="font-medium">Totals</TableCell>
                    <TableCell className="text-right">{fmt(runQuery.data.run.gross_pay)}</TableCell>
                    <TableCell className="text-right">{fmt(runQuery.data.run.total_allowances)}</TableCell>
                    <TableCell className="text-right">{fmt(runQuery.data.run.total_deductions)}</TableCell>
                    <TableCell className="text-right">{fmt(runQuery.data.run.total_tax)}</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(runQuery.data.run.net_pay)}</TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function fmt(v?: number | null) {
  const n = Number(v ?? 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
