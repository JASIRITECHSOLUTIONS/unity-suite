-- Admin module support: system_settings and audit_logs with RLS and seeds

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NULL,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Policies: super_admin can access all; admins can access their org's settings
DROP POLICY IF EXISTS "Admins can view system settings" ON public.system_settings;
CREATE POLICY "Admins can view system settings"
ON public.system_settings
FOR SELECT
USING (
  has_role('super_admin') OR has_role('admin', organization_id)
);

DROP POLICY IF EXISTS "Admins can insert system settings" ON public.system_settings;
CREATE POLICY "Admins can insert system settings"
ON public.system_settings
FOR INSERT
WITH CHECK (
  has_role('super_admin') OR has_role('admin', organization_id)
);

DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;
CREATE POLICY "Admins can update system settings"
ON public.system_settings
FOR UPDATE
USING (
  has_role('super_admin') OR has_role('admin', organization_id)
);

DROP POLICY IF EXISTS "Admins can delete system settings" ON public.system_settings;
CREATE POLICY "Admins can delete system settings"
ON public.system_settings
FOR DELETE
USING (
  has_role('super_admin') OR has_role('admin', organization_id)
);

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_system_settings_org ON public.system_settings (organization_id);


-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid NULL,
  action text NOT NULL,
  resource text NULL,
  details jsonb NULL,
  ip_address text NULL,
  user_agent text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies: super_admin can see all, admins can see org logs, users can see own logs
DROP POLICY IF EXISTS "Audit logs visibility" ON public.audit_logs;
CREATE POLICY "Audit logs visibility"
ON public.audit_logs
FOR SELECT
USING (
  has_role('super_admin') OR has_role('admin', organization_id) OR user_id = auth.uid()
);

-- Allow inserts for self only
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert their own audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

-- Optional: prevent updates/deletes by default (no policies)

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs (organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);


-- Seed: ensure at least one organization exists
INSERT INTO public.organizations (name, email, phone)
SELECT 'Default Organization', 'org@example.com', '+000000000'
WHERE NOT EXISTS (SELECT 1 FROM public.organizations);

-- Seed: ensure each organization has a system_settings row
INSERT INTO public.system_settings (organization_id, settings)
SELECT o.id, '{"theme":"default","modules":{"finance":true,"procurement":true,"stores":true,"hrm":true,"payroll":false}}'::jsonb
FROM public.organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM public.system_settings s WHERE s.organization_id = o.id
);
