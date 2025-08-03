-- Create invoices table for Finance module
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  organization_id uuid,
  invoice_number text NOT NULL UNIQUE,
  client_name text NOT NULL,
  client_email text,
  amount decimal(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create purchase_orders table for Procurement module
CREATE TABLE public.purchase_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  organization_id uuid,
  po_number text NOT NULL UNIQUE,
  supplier_name text NOT NULL,
  supplier_email text,
  total_amount decimal(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_by uuid NOT NULL,
  approved_by uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create inventory_items table for Stores module
CREATE TABLE public.inventory_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  organization_id uuid,
  item_name text NOT NULL,
  item_code text UNIQUE,
  category text,
  current_stock integer NOT NULL DEFAULT 0,
  minimum_stock integer NOT NULL DEFAULT 0,
  unit_price decimal(10,2),
  supplier text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create employees table for HRM module
CREATE TABLE public.employees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  organization_id uuid,
  employee_id text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  department text,
  position text,
  hire_date date,
  salary decimal(10,2),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(organization_id, employee_id)
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view invoices in their organization" 
ON public.invoices 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Users can create invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() AND
  (organization_id IS NULL OR organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  ))
);

CREATE POLICY "Users can update their own invoices" 
ON public.invoices 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create RLS policies for purchase_orders
CREATE POLICY "Users can view purchase orders in their organization" 
ON public.purchase_orders 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Users can create purchase orders" 
ON public.purchase_orders 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() AND
  (organization_id IS NULL OR organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  ))
);

CREATE POLICY "Users can update purchase orders in their organization" 
ON public.purchase_orders 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR user_id = auth.uid()
);

-- Create RLS policies for inventory_items
CREATE POLICY "Users can view inventory in their organization" 
ON public.inventory_items 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Users can manage inventory in their organization" 
ON public.inventory_items 
FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR user_id = auth.uid()
);

-- Create RLS policies for employees
CREATE POLICY "Users can view employees in their organization" 
ON public.employees 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM user_roles 
    WHERE user_id = auth.uid() AND is_active = true
  )
  OR user_id = auth.uid()
);

CREATE POLICY "Admins and HR can manage employees in their organization" 
ON public.employees 
FOR ALL 
USING (
  (has_role('admin'::user_role) OR has_role('super_admin'::user_role) OR 
   EXISTS (
     SELECT 1 FROM user_roles 
     WHERE user_id = auth.uid() 
     AND 'hrm' = ANY(module_permissions) 
     AND is_active = true
   ))
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();