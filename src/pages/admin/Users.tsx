import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProfileRow {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
}

const roles = ["super_admin", "admin", "manager", "employee", "viewer"] as const;
const modules = ["finance", "procurement", "stores", "hrm", "payroll"] as const;

export default function AdminUsers() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    profile_id: "",
    role: "employee" as typeof roles[number],
    module_permissions: [] as string[],
  });

  const loadProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id,user_id,email,first_name,last_name,organization_id")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfiles(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const submitGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    const profile = profiles.find(p => p.id === form.profile_id);
    if (!profile) return;
    const { error } = await supabase.from("user_roles").insert({
      user_id: profile.user_id,
      organization_id: profile.organization_id,
      role: form.role as any,
      module_permissions: form.module_permissions as any,
      is_active: true,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role granted", description: `Granted ${form.role} to ${profile.email}` });
      setOpen(false);
      setForm({ profile_id: "", role: "employee", module_permissions: [] });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles and module permissions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Grant Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Role</DialogTitle>
              <DialogDescription>Assign a role and module access to a user</DialogDescription>
            </DialogHeader>
            <form onSubmit={submitGrant} className="space-y-4">
              <div className="grid gap-2">
                <Label>User</Label>
                <Select value={form.profile_id} onValueChange={(v) => setForm({ ...form, profile_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.email} {p.first_name || p.last_name ? `• ${(p.first_name||'')} ${(p.last_name||'')}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r} value={r}>{r.replace('_',' ').toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Module Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {modules.map(m => (
                    <Button
                      key={m}
                      type="button"
                      variant={form.module_permissions.includes(m) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const exists = form.module_permissions.includes(m);
                        setForm({
                          ...form,
                          module_permissions: exists
                            ? form.module_permissions.filter(x => x !== m)
                            : [...form.module_permissions, m]
                        });
                      }}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Grant</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-3">
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{p.email}</p>
                    <p className="text-sm text-muted-foreground">{[p.first_name, p.last_name].filter(Boolean).join(' ')}</p>
                  </div>
                  {p.organization_id ? (
                    <Badge variant="secondary">Org Member</Badge>
                  ) : (
                    <Badge variant="outline">No Org</Badge>
                  )}
                </div>
              ))}
              {profiles.length === 0 && (
                <p className="text-sm text-muted-foreground">No users found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
