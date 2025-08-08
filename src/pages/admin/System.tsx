import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SettingsRow {
  id: string;
  organization_id: string | null;
  settings: any;
}

export default function AdminSystem() {
  const { toast } = useToast();
  const [rows, setRows] = useState<SettingsRow[]>([]);
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("system_settings").select("id,organization_id,settings").order("created_at", { ascending: true });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      setRows(data as any);
      const map: Record<string,string> = {};
      (data || []).forEach((r: any) => { map[r.id] = JSON.stringify(r.settings, null, 2); });
      setRaw(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (id: string) => {
    try {
      const json = JSON.parse(raw[id] || '{}');
      const { error } = await supabase.from("system_settings").update({ settings: json }).eq("id", id);
      if (error) throw error;
      toast({ title: "Saved", description: "Settings updated" });
      load();
    } catch (e: any) {
      toast({ title: "Invalid JSON", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Global and organization-level configurations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Edit JSON settings for each organization</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-6">
              {rows.map((r) => (
                <div key={r.id} className="space-y-2 p-4 border rounded-lg">
                  <Label>Organization: {r.organization_id || 'System-wide'}</Label>
                  <Textarea className="min-h-[200px]" value={raw[r.id] || ''} onChange={(e) => setRaw(prev => ({ ...prev, [r.id]: e.target.value }))} />
                  <div className="flex justify-end">
                    <Button onClick={() => save(r.id)}>Save</Button>
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <p className="text-sm text-muted-foreground">No settings found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
