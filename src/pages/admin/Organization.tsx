import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface OrgRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export default function AdminOrganization() {
  const { toast } = useToast();
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Record<string, Partial<OrgRow>>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("organizations").select("id,name,email,phone").order("created_at", { ascending: true });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setOrgs(data as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (id: string) => {
    const payload = edit[id];
    if (!payload) return;
    const { error } = await supabase.from("organizations").update(payload).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved", description: "Organization updated" });
      setEdit(prev => ({ ...prev, [id]: {} }));
      load();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your organization profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>View and edit organizations you manage</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-4">
              {orgs.map((o) => (
                <div key={o.id} className="p-4 border rounded-lg space-y-3">
                  <div className="grid gap-2 md:grid-cols-3">
                    <div>
                      <Label>Name</Label>
                      <Input defaultValue={o.name} onChange={(e) => setEdit(prev => ({ ...prev, [o.id]: { ...prev[o.id], name: e.target.value } }))} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input defaultValue={o.email || ''} onChange={(e) => setEdit(prev => ({ ...prev, [o.id]: { ...prev[o.id], email: e.target.value } }))} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input defaultValue={o.phone || ''} onChange={(e) => setEdit(prev => ({ ...prev, [o.id]: { ...prev[o.id], phone: e.target.value } }))} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => save(o.id)}>Save</Button>
                  </div>
                </div>
              ))}
              {orgs.length === 0 && (
                <p className="text-sm text-muted-foreground">No organizations found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
