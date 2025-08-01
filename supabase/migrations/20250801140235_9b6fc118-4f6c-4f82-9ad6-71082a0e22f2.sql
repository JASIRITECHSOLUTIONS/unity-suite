-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'manager', 'employee', 'viewer');

-- Create enum for organization types  
CREATE TYPE public.organization_type AS ENUM ('enterprise', 'sme', 'startup', 'non_profit', 'government');

-- Create enum for module permissions
CREATE TYPE public.module_name AS ENUM ('finance', 'procurement', 'stores', 'hrm', 'payroll', 'admin');

-- Create organizations table
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type organization_type NOT NULL DEFAULT 'enterprise',
    description TEXT,
    email TEXT,
    phone TEXT,
    address JSONB,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    department TEXT,
    position TEXT,
    employee_id TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'employee',
    module_permissions module_name[] DEFAULT '{}',
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(user_id, organization_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role(org_id UUID DEFAULT NULL)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
    AND (org_id IS NULL OR organization_id = org_id)
    AND is_active = true
  ORDER BY 
    CASE role 
      WHEN 'super_admin' THEN 1
      WHEN 'admin' THEN 2  
      WHEN 'manager' THEN 3
      WHEN 'employee' THEN 4
      WHEN 'viewer' THEN 5
    END
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role user_role, org_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE  
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid()
      AND (org_id IS NULL OR organization_id = org_id)
      AND role = required_role
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_module_access(module module_name, org_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER  
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND (org_id IS NULL OR organization_id = org_id)
      AND (module = ANY(module_permissions) OR role IN ('super_admin', 'admin'))
      AND is_active = true
  );
$$;

-- Create RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to"
ON public.organizations FOR SELECT
USING (
  id IN (
    SELECT organization_id FROM public.user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Admins can manage organizations"
ON public.organizations FOR ALL
USING (public.has_role('admin') OR public.has_role('super_admin'));

-- Create RLS policies for profiles  
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles in their organization"
ON public.profiles FOR SELECT
USING (
  (public.has_role('admin') OR public.has_role('super_admin')) AND
  organization_id IN (
    SELECT organization_id FROM public.user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles in their organization"
ON public.user_roles FOR ALL
USING (
  (public.has_role('admin') OR public.has_role('super_admin')) AND
  organization_id IN (
    SELECT organization_id FROM public.user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles  
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_organization_id ON public.user_roles(organization_id);
CREATE INDEX idx_user_roles_active ON public.user_roles(is_active) WHERE is_active = true;