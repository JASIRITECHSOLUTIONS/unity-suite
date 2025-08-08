import { supabase } from "@/integrations/supabase/client";

export type PayrollRunStatus = "draft" | "processing" | "completed" | "cancelled";

export type PayrollRun = {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  period_start: string; // ISO date
  period_end: string; // ISO date
  status: PayrollRunStatus;
  gross_pay: number | null;
  total_allowances: number | null;
  total_deductions: number | null;
  total_tax: number | null;
  net_pay: number | null;
  created_at: string;
  updated_at?: string;
};

export type PayrollRunItem = {
  id: string;
  run_id: string;
  employee_id: string;
  employee_name: string | null;
  basic_pay: number;
  allowances: number;
  deductions: number;
  tax: number;
  net_pay: number;
  created_at: string;
};

export async function listPayrollRuns(opts?: {
  orgId?: string | null;
  search?: string;
  status?: PayrollRunStatus | "all";
}) {
  let query = supabase.from("payroll_runs").select("*").order("created_at", { ascending: false });

  if (opts?.orgId) query = query.eq("organization_id", opts.orgId);
  if (opts?.status && opts.status !== "all") query = query.eq("status", opts.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as PayrollRun[];
}

export async function getPayrollRun(runId: string) {
  const { data: run, error: runErr } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", runId)
    .single();

  if (runErr) throw runErr;

  const { data: items, error: itemsErr } = await supabase
    .from("payroll_run_items")
    .select("*")
    .eq("run_id", runId)
    .order("created_at", { ascending: true });

  if (itemsErr) throw itemsErr;

  return { run: run as PayrollRun, items: (items || []) as PayrollRunItem[] };
}

export async function createPayrollRun(params: {
  orgId?: string | null;
  userId?: string | null;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
}) {
  const payload = {
    organization_id: params.orgId ?? null,
    user_id: params.userId ?? null,
    period_start: params.periodStart,
    period_end: params.periodEnd,
    status: "draft" as PayrollRunStatus,
    gross_pay: 0,
    total_allowances: 0,
    total_deductions: 0,
    total_tax: 0,
    net_pay: 0,
  };

  const { data, error } = await supabase.from("payroll_runs").insert(payload).select("*").single();
  if (error) throw error;
  return data as PayrollRun;
}

export async function addEmployeeToRun(params: {
  runId: string;
  employeeId: string;
  employeeName?: string | null;
  basicPay: number;
  allowances?: number;
  deductions?: number;
  tax?: number;
}) {
  const allowances = params.allowances ?? 0;
  const deductions = params.deductions ?? 0;
  const tax = params.tax ?? Math.round((params.basicPay + allowances) * 0.16 * 100) / 100; // 16% default
  const net_pay = Math.round((params.basicPay + allowances - deductions - tax) * 100) / 100;

  const payload = {
    run_id: params.runId,
    employee_id: params.employeeId,
    employee_name: params.employeeName ?? null,
    basic_pay: params.basicPay,
    allowances,
    deductions,
    tax,
    net_pay,
  };

  const { data, error } = await supabase.from("payroll_run_items").insert(payload).select("*").single();
  if (error) throw error;

  await recomputeRunTotals(params.runId);

  return data as PayrollRunItem;
}

export async function removeItemFromRun(itemId: string, runId: string) {
  const { error } = await supabase.from("payroll_run_items").delete().eq("id", itemId);
  if (error) throw error;
  await recomputeRunTotals(runId);
}

export async function finalizePayrollRun(runId: string) {
  await recomputeRunTotals(runId);
  const { data, error } = await supabase
    .from("payroll_runs")
    .update({ status: "completed" as PayrollRunStatus })
    .eq("id", runId)
    .select("*")
    .single();
  if (error) throw error;
  return data as PayrollRun;
}

export async function cancelPayrollRun(runId: string) {
  const { data, error } = await supabase
    .from("payroll_runs")
    .update({ status: "cancelled" as PayrollRunStatus })
    .eq("id", runId)
    .select("*")
    .single();
  if (error) throw error;
  return data as PayrollRun;
}

export async function recomputeRunTotals(runId: string) {
  const { data: items, error } = await supabase
    .from("payroll_run_items")
    .select("basic_pay,allowances,deductions,tax,net_pay")
    .eq("run_id", runId);

  if (error) throw error;

  const totals = (items ?? []).reduce(
    (acc, it) => {
      acc.gross += Number(it.basic_pay || 0);
      acc.allowances += Number(it.allowances || 0);
      acc.deductions += Number(it.deductions || 0);
      acc.tax += Number(it.tax || 0);
      acc.net += Number(it.net_pay || 0);
      return acc;
    },
    { gross: 0, allowances: 0, deductions: 0, tax: 0, net: 0 }
  );

  const { error: updErr } = await supabase
    .from("payroll_runs")
    .update({
      gross_pay: totals.gross,
      total_allowances: totals.allowances,
      total_deductions: totals.deductions,
      total_tax: totals.tax,
      net_pay: totals.net,
    })
    .eq("id", runId);

  if (updErr) throw updErr;
}

export function exportRunToCSV(run: PayrollRun, items: PayrollRunItem[]) {
  const header = [
    "Employee ID",
    "Employee Name",
    "Basic Pay",
    "Allowances",
    "Deductions",
    "Tax",
    "Net Pay",
  ];
  const rows = items.map((i) => [
    i.employee_id,
    i.employee_name ?? "",
    i.basic_pay.toFixed(2),
    i.allowances.toFixed(2),
    i.deductions.toFixed(2),
    i.tax.toFixed(2),
    i.net_pay.toFixed(2),
  ]);

  const totalsRow = ["", "Totals",
    (run.gross_pay ?? 0).toFixed(2),
    (run.total_allowances ?? 0).toFixed(2),
    (run.total_deductions ?? 0).toFixed(2),
    (run.total_tax ?? 0).toFixed(2),
    (run.net_pay ?? 0).toFixed(2),
  ];

  const csv = [header, ...rows, totalsRow].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payroll_run_${run.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
