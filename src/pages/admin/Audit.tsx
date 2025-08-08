import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LogRow {
  id: string;
  action: string;
  resource: string | null;
  created_at: string;
  details: any;
}

export default function AdminAudit() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [filter, setFilter] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("audit_logs")
      .select("id,action,resource,created_at,details")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs((data || []) as any);
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter(l => [l.action, l.resource, JSON.stringify(l.details||{})].join(" ").toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">System activity across your organization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>Last 100 events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search logs..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
          <div className="space-y-3">
            {filtered.map(log => (
              <div key={log.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{log.action}</p>
                  <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                </div>
                {log.resource && <p className="text-sm text-muted-foreground">Resource: {log.resource}</p>}
                {log.details && (
                  <pre className="text-xs mt-2 bg-muted p-2 rounded overflow-auto max-h-40">{JSON.stringify(log.details, null, 2)}</pre>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No logs found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
