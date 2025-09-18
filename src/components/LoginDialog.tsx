import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Car, Building } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (type: 'customer' | 'owner') => {
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await login(email, password, type);
      onOpenChange(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to ParkEasy</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Owner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('customer')}
                    disabled={loading || !email || !password}
                  >
                    {loading ? 'Signing in...' : 'Sign in as Customer'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="owner" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="owner-email">Email</Label>
                    <Input
                      id="owner-email"
                      type="email"
                      placeholder="owner@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-password">Password</Label>
                    <Input
                      id="owner-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('owner')}
                    disabled={loading || !email || !password}
                  >
                    {loading ? 'Signing in...' : 'Sign in as Owner'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Owner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="customer-first-name">First Name</Label>
                      <Input
                        id="customer-first-name"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-last-name">Last Name</Label>
                      <Input
                        id="customer-last-name"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="customer-signup-email">Email</Label>
                    <Input
                      id="customer-signup-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-phone">Phone Number</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-address">Address</Label>
                    <Input
                      id="customer-address"
                      placeholder="123 Main Street, City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-signup-password">Password</Label>
                    <Input
                      id="customer-signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-confirm-password">Confirm Password</Label>
                    <Input
                      id="customer-confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('customer')}
                    disabled={loading || !email || !password}
                  >
                    {loading ? 'Creating account...' : 'Create Customer Account'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="owner" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="owner-first-name">First Name</Label>
                      <Input
                        id="owner-first-name"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="owner-last-name">Last Name</Label>
                      <Input
                        id="owner-last-name"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="owner-signup-email">Email</Label>
                    <Input
                      id="owner-signup-email"
                      type="email"
                      placeholder="owner@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-phone">Phone Number</Label>
                    <Input
                      id="owner-phone"
                      type="tel"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-business-name">Business Name</Label>
                    <Input
                      id="owner-business-name"
                      placeholder="Your Parking Business"
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-business-address">Business Address</Label>
                    <Input
                      id="owner-business-address"
                      placeholder="123 Business Street, City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-signup-password">Password</Label>
                    <Input
                      id="owner-signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner-confirm-password">Confirm Password</Label>
                    <Input
                      id="owner-confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleLogin('owner')}
                    disabled={loading || !email || !password}
                  >
                    {loading ? 'Creating account...' : 'Create Owner Account'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>Demo credentials:</p>
          <p>Customer: customer@demo.com / password</p>
          <p>Owner: owner@demo.com / password</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}