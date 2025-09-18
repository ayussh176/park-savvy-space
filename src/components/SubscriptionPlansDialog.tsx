import { Check, Crown, Star, Zap } from 'lucide-react';
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

interface SubscriptionPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionPlansDialog({ open, onOpenChange }: SubscriptionPlansDialogProps) {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₹999',
      period: '/month',
      icon: Star,
      popular: false,
      features: [
        'List up to 5 parking spaces',
        'Basic analytics dashboard',
        'Email support',
        'Mobile app access',
        'Standard transaction fees'
      ]
    },
    {
      id: 'lite',
      name: 'Lite',
      price: '₹1,999',
      period: '/month',
      icon: Zap,
      popular: true,
      features: [
        'List up to 15 parking spaces',
        'Advanced analytics & reports',
        'Priority email & chat support',
        'Mobile app access',
        'Reduced transaction fees',
        'Custom pricing schedules',
        'Bulk slot management'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹3,999',
      period: '/month',
      icon: Crown,
      popular: false,
      features: [
        'Unlimited parking spaces',
        'Complete analytics suite',
        '24/7 phone & chat support',
        'Mobile app access',
        'Lowest transaction fees',
        'Custom pricing schedules',
        'Bulk slot management',
        'API access',
        'White-label solutions',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your parking business needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative border transition-all hover:shadow-lg ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="success" className="px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.popular ? 'Upgrade Now' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>All plans include a 14-day free trial. Cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}