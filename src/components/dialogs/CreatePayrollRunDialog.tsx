import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createPayrollRun } from "@/services/payroll";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from 'lucide-react';

type Props = {
  onCreated?: (runId: string) => void;
  trigger?: React.ReactNode;
};

export default function CreatePayrollRunDialog({ onCreated, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const { user, userRole } = useAuth();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      if (!periodStart || !periodEnd) throw new Error("Please select a start and end date.");
      const run = await createPayrollRun({
        orgId: userRole?.organization_id ?? null,
        userId: user?.id ?? null,
        periodStart,
        periodEnd,
      });
      return run;
    },
    onSuccess: (run) => {
      setOpen(false);
      setPeriodStart("");
      setPeriodEnd("");
      onCreated?.(run.id);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm">New Payroll Run</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payroll Run</DialogTitle>
          <DialogDescription>Select the period for this payroll run.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodStart">Period Start</Label>
              <Input id="periodStart" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="periodEnd">Period End</Label>
              <Input id="periodEnd" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => mutate()} disabled={isPending}>
            {isPending ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating...</span> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
