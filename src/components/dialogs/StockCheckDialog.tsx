import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, Search, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  item_name: string;
  item_code: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  unit_price: number;
  supplier: string;
}

interface StockCheckDialogProps {
  children?: React.ReactNode;
}

export const StockCheckDialog = ({ children }: StockCheckDialogProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { profile } = useAuth();

  const fetchInventoryItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('item_name');

      if (error) throw error;
      setItems(data || []);
      setFilteredItems(data || []);
    } catch (error: any) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchInventoryItems();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredItems(
        items.filter(item => 
          item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (current <= minimum) return { status: 'Low Stock', variant: 'secondary' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="justify-start h-auto p-4">
            <Package className="mr-2 h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Stock Check</div>
              <div className="text-xs text-muted-foreground">View inventory levels</div>
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Inventory Stock Check</DialogTitle>
          <DialogDescription>
            Current stock levels across all inventory items
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[400px] w-full">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {items.length === 0 ? 'No inventory items found' : 'No items match your search'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.current_stock, item.minimum_stock);
                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.item_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.item_code && `Code: ${item.item_code}`}
                          {item.category && ` • Category: ${item.category}`}
                        </p>
                      </div>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Stock:</span>
                        <span className="ml-1 font-medium">{item.current_stock}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min. Stock:</span>
                        <span className="ml-1 font-medium">{item.minimum_stock}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unit Price:</span>
                        <span className="ml-1 font-medium">${item.unit_price?.toFixed(2) || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {item.supplier && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="ml-1">{item.supplier}</span>
                      </div>
                    )}
                    
                    {item.current_stock <= item.minimum_stock && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        Stock running low - consider reordering
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
