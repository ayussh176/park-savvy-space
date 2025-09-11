import { useState } from 'react';
import { Wallet, Plus, CreditCard, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletDialog({ open, onOpenChange }: WalletDialogProps) {
  const [balance, setBalance] = useState(2450);
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'debit',
      amount: 150,
      description: 'Parking at Central Mall',
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: '2',
      type: 'credit',
      amount: 500,
      description: 'Wallet Top-up',
      date: '2024-01-19',
      status: 'completed'
    },
    {
      id: '3',
      type: 'debit',
      amount: 75,
      description: 'Metro Station Parking',
      date: '2024-01-18',
      status: 'completed'
    },
    {
      id: '4',
      type: 'credit',
      amount: 1000,
      description: 'Refund - Cancelled Booking',
      date: '2024-01-17',
      status: 'completed'
    }
  ]);

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setBalance(prev => prev + amount);
    setAddAmount('');
    setShowAddMoney(false);
    toast({
      title: "Money Added",
      description: `₹${amount} has been added to your wallet`
    });
  };

  const quickAddAmounts = [100, 250, 500, 1000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            My Wallet
          </DialogTitle>
          <DialogDescription>
            Manage your wallet balance and view transaction history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Balance */}
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Current Balance</p>
                  <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
                </div>
                <Wallet className="h-12 w-12 text-primary-foreground/50" />
              </div>
              <Button 
                onClick={() => setShowAddMoney(!showAddMoney)} 
                variant="secondary" 
                className="mt-4 w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
            </CardContent>
          </Card>

          {/* Add Money Section */}
          {showAddMoney && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Add Money to Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="add-amount">Amount (₹)</Label>
                  <Input
                    id="add-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Quick Add</p>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAddAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setAddAmount(amount.toString())}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddMoney} className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Money
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddMoney(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Added</p>
                    <p className="font-bold text-success">₹1,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-bold text-warning">₹225</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' 
                          ? 'bg-success-light text-success' 
                          : 'bg-warning-light text-warning'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-success' : 'text-warning'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <Badge variant={
                        transaction.status === 'completed' ? 'success' : 
                        transaction.status === 'pending' ? 'warning' : 'destructive'
                      } className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}