-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage roles in their organization" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a simple policy for users to view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Create a policy for admins using the existing security definer function
CREATE POLICY "Admins can manage roles in their organization" 
ON public.user_roles 
FOR ALL 
USING (
  (has_role('admin'::user_role) OR has_role('super_admin'::user_role))
);
