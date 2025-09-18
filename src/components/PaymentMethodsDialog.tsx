import { CreditCard, Smartphone, Building, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentMethodsDialog({ open, onOpenChange }: PaymentMethodsDialogProps) {
  const paymentMethods = [
    {
      id: 1,
      type: 'UPI',
      name: 'Google Pay',
      identifier: 'user@oksbi',
      icon: Smartphone,
      verified: true
    },
    {
      id: 2,
      type: 'Card',
      name: 'SBI Credit Card',
      identifier: '**** **** **** 1234',
      icon: CreditCard,
      verified: true
    },
    {
      id: 3,
      type: 'Net Banking',
      name: 'State Bank of India',
      identifier: 'SBI Net Banking',
      icon: Building,
      verified: true
    },
    {
      id: 4,
      type: 'Cash',
      name: 'Pay on Spot',
      identifier: 'Cash Payment',
      icon: Wallet,
      verified: false
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Methods</DialogTitle>
          <DialogDescription>
            Manage your payment methods for quick checkout
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <Card key={method.id} className="border hover:shadow-sm transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.identifier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.verified && (
                        <Badge variant="success" className="text-xs">Verified</Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {method.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1">
            Add New Method
          </Button>
          <Button variant="hero" className="flex-1">
            Set as Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}