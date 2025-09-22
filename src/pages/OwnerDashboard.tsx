import { useState } from 'react';
import { Plus, Building, BarChart3, Settings, MapPin, Car, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ManageParkingDialog } from '@/components/ManageParkingDialog';
import { SubscriptionPlansDialog } from '@/components/SubscriptionPlansDialog';
import { mockParkingSpaces } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [selectedParkingSpace, setSelectedParkingSpace] = useState<any>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  
  // Filter parking spaces owned by current user
  const ownedParkingSpaces = mockParkingSpaces.filter(space => space.owner.id === user?.id || space.owner.id === 'owner1');

  const totalRevenue = ownedParkingSpaces.reduce((total, space) => {
    return total + (space.pricePerHour * (space.totalSlots - space.availableSlots));
  }, 0);

  const totalBookings = ownedParkingSpaces.reduce((total, space) => {
    return total + (space.totalSlots - space.availableSlots);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your parking spaces and track earnings</p>
          </div>
          <Button asChild variant="hero" size="lg">
            <Link to="/list-parking">
              <Plus className="h-5 w-5 mr-2" />
              List New Parking
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spaces</p>
                  <p className="text-2xl font-bold">{ownedParkingSpaces.length}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Bookings</p>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                </div>
                <Car className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold">₹{totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">₹{totalRevenue * 30}</p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* My Parking Spaces */}
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Parking Spaces</CardTitle>
                <Button asChild variant="outline">
                  <Link to="/list-parking">Add New</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ownedParkingSpaces.length > 0 ? (
                    ownedParkingSpaces.map((space) => (
                      <Card key={space.id} className="border border-border hover:shadow-elevated transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{space.name}</h3>
                              <p className="text-muted-foreground text-sm flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {space.address}
                              </p>
                            </div>
                            <Badge variant="secondary" className="capitalize">
                              {space.type}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-secondary/50 rounded-lg">
                              <p className="text-lg font-bold text-primary">{space.totalSlots}</p>
                              <p className="text-xs text-muted-foreground">Total Slots</p>
                            </div>
                            <div className="text-center p-3 bg-success-light rounded-lg">
                              <p className="text-lg font-bold text-success">{space.availableSlots}</p>
                              <p className="text-xs text-muted-foreground">Available</p>
                            </div>
                            <div className="text-center p-3 bg-warning-light rounded-lg">
                              <p className="text-lg font-bold text-warning">{space.totalSlots - space.availableSlots}</p>
                              <p className="text-xs text-muted-foreground">Occupied</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold">₹{space.pricePerHour}/hr</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                Revenue: ₹{space.pricePerHour * (space.totalSlots - space.availableSlots)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedParkingSpace(space);
                                  setShowManageDialog(true);
                                }}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Manage
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  // Simple confirmation for delete
                                  if (window.confirm(`Are you sure you want to delete "${space.name}"?`)) {
                                    // In a real app, this would call an API
                                    window.location.reload();
                                  }
                                }}
                              >
                                Delete
                              </Button>
                              <Button asChild variant="hero" size="sm">
                                <Link to={`/parking/${space.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Parking Spaces Yet</h3>
                      <p className="text-muted-foreground mb-4">Start by listing your first parking space</p>
                      <Button asChild variant="hero">
                        <Link to="/list-parking">List Your First Space</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card className="shadow-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="success" className="mb-3">Basic Plan</Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    List up to 5 parking spaces
                  </p>
                  <Button 
                    variant="hero" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowSubscriptionDialog(true)}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>New booking at Central Mall</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Payment received ₹150</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Slot A5 became available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedParkingSpace && (
        <ManageParkingDialog
          open={showManageDialog}
          onOpenChange={setShowManageDialog}
          parkingSpace={selectedParkingSpace}
        />
      )}

      <SubscriptionPlansDialog
        open={showSubscriptionDialog}
        onOpenChange={setShowSubscriptionDialog}
      />
    </div>
  );
};

export default OwnerDashboard;