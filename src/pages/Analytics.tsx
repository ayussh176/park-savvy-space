import { BarChart3, TrendingUp, DollarSign, Car, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.type !== 'owner') {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in as an owner to view analytics</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Mock analytics data
  const analyticsData = {
    today: {
      bookings: 45,
      revenue: 2250,
      occupancyRate: 75,
      newCustomers: 8
    },
    week: {
      bookings: 312,
      revenue: 15600,
      occupancyRate: 68,
      newCustomers: 42
    },
    month: {
      bookings: 1340,
      revenue: 67000,
      occupancyRate: 72,
      newCustomers: 156
    }
  };

  const recentActivity = [
    { id: 1, action: 'New booking', space: 'Central Mall Parking', amount: 150, time: '2 mins ago' },
    { id: 2, action: 'Payment received', space: 'Metro Station Parking', amount: 90, time: '15 mins ago' },
    { id: 3, action: 'Booking completed', space: 'Hospital Parking', amount: 120, time: '1 hour ago' },
    { id: 4, action: 'New customer', space: 'Central Mall Parking', amount: 0, time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your parking space performance</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="week">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold">{analyticsData.week.bookings}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+12% from last week</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  <p className="text-3xl font-bold">₹{analyticsData.week.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+8% from last week</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  <p className="text-3xl font-bold">{analyticsData.week.occupancyRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-warning" />
                    <span className="text-xs text-warning">+3% from last week</span>
                  </div>
                </div>
                <Car className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-3xl font-bold">{analyticsData.week.newCustomers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    <span className="text-xs text-accent">+25% from last week</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Revenue chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Patterns */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Booking Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Peak Hours (9 AM - 12 PM)</span>
                    <Badge variant="success">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Afternoon (12 PM - 6 PM)</span>
                    <Badge variant="warning">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Evening (6 PM - 9 PM)</span>
                    <Badge variant="secondary">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Night (9 PM - 9 AM)</span>
                    <Badge variant="secondary">Very Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance by Space */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Performance by Parking Space</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium">Central Mall Parking</p>
                      <p className="text-sm text-muted-foreground">125 bookings this week</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">₹6,250</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium">Metro Station Parking</p>
                      <p className="text-sm text-muted-foreground">98 bookings this week</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">₹4,900</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium">Hospital Parking</p>
                      <p className="text-sm text-muted-foreground">89 bookings this week</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">₹4,450</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">₹{analyticsData.today.revenue}</p>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{analyticsData.today.bookings}</p>
                  <p className="text-sm text-muted-foreground">Today's Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{analyticsData.today.occupancyRate}%</p>
                  <p className="text-sm text-muted-foreground">Current Occupancy</p>
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
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-muted-foreground text-xs">{activity.space}</p>
                      </div>
                      <div className="text-right">
                        {activity.amount > 0 && (
                          <p className="font-medium text-success">₹{activity.amount}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Raj Sharma</span>
                    <Badge variant="outline">12 bookings</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Priya Singh</span>
                    <Badge variant="outline">8 bookings</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Amit Kumar</span>
                    <Badge variant="outline">6 bookings</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;