import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Ticket, Calendar, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from '@/hooks/useAdminData';
import { format } from 'date-fns';

const CouponForm = ({
  coupon,
  onClose,
}: {
  coupon?: any;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discount_type: coupon?.discount_type || 'percentage',
    discount_value: coupon?.discount_value || '',
    min_order_amount: coupon?.min_order_amount || '',
    max_uses: coupon?.max_uses || '',
    expiry_date: coupon?.expiry_date ? format(new Date(coupon.expiry_date), "yyyy-MM-dd'T'HH:mm") : '',
    is_active: coupon?.is_active ?? true,
  });

  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const couponData = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type as 'percentage' | 'fixed',
      discount_value: parseFloat(formData.discount_value),
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
      is_active: formData.is_active,
    };

    if (coupon) {
      await updateCoupon.mutateAsync({ id: coupon.id, ...couponData });
    } else {
      await createCoupon.mutateAsync(couponData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="code">Coupon Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="e.g., SUMMER20"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_type">Discount Type</Label>
          <Select
            value={formData.discount_type}
            onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount_value">Discount Value</Label>
          <Input
            id="discount_value"
            type="number"
            step="0.01"
            value={formData.discount_value}
            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
            placeholder={formData.discount_type === 'percentage' ? '20' : '100'}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min_order">Min. Order Amount (₹)</Label>
          <Input
            id="min_order"
            type="number"
            step="0.01"
            value={formData.min_order_amount}
            onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_uses">Max Uses</Label>
          <Input
            id="max_uses"
            type="number"
            value={formData.max_uses}
            onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
            placeholder="Unlimited"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry">Expiry Date</Label>
        <Input
          id="expiry"
          type="datetime-local"
          value={formData.expiry_date}
          onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={createCoupon.isPending || updateCoupon.isPending}>
          {coupon ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </form>
  );
};

const Coupons = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const { data: coupons, isLoading } = useCoupons();
  const deleteCoupon = useDeleteCoupon();

  const handleEdit = (coupon: any) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setDialogOpen(true);
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage discount coupons</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </DialogTitle>
            </DialogHeader>
            <CouponForm
              coupon={selectedCoupon}
              onClose={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : coupons?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No coupons yet</p>
            <Button variant="outline" onClick={handleCreate}>
              Create your first coupon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons?.map((coupon: any) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="hover:shadow-warm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground font-mono">
                        {coupon.code}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {coupon.is_active && !isExpired(coupon.expiry_date) ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </Badge>
                        ) : isExpired(coupon.expiry_date) ? (
                          <Badge variant="secondary">Expired</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete coupon "{coupon.code}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCoupon.mutate(coupon.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-foreground">
                      {coupon.discount_type === 'percentage' ? (
                        <Percent className="w-4 h-4 text-primary" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-primary" />
                      )}
                      <span className="font-semibold">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% off`
                          : `₹${coupon.discount_value} off`}
                      </span>
                    </div>

                    {coupon.min_order_amount > 0 && (
                      <p className="text-muted-foreground">
                        Min. order: ₹{coupon.min_order_amount}
                      </p>
                    )}

                    {coupon.expiry_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Expires: {format(new Date(coupon.expiry_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    <p className="text-muted-foreground">
                      Used: {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;
