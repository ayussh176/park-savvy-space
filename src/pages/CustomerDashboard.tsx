import { useState } from 'react';
import { Search, MapPin, Calendar, Car, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MapComponent } from '@/components/MapComponent';
import { mockParkingSpaces, mockBookings } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const filteredParkingSpaces = mockParkingSpaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userBookings = mockBookings.filter(booking => booking.userId === user?.id);

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Find and book parking spaces near you</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Parking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for parking areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleLocationSelect} variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Current Location
              </Button>
              <Button variant="hero">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Nearby Parking Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapComponent 
                    parkingSpaces={filteredParkingSpaces}
                    userLocation={selectedLocation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recommended Parking */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredParkingSpaces.slice(0, 4).map((space) => (
                    <Card key={space.id} className="hover:shadow-elevated transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{space.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="text-sm">{space.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {space.distance}km away
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-primary">₹{space.pricePerHour}/hr</span>
                          <span className="text-sm text-success">{space.availableSlots} available</span>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm" className="flex-1">
                            <Link to={`/parking/${space.id}`}>Details</Link>
                          </Button>
                          <Button asChild variant="hero" size="sm" className="flex-1">
                            <Link to={`/book/${space.id}`}>Book</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                  <Link to="/profile">
                    <Car className="h-4 w-4 mr-2" />
                    My Vehicles
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/profile">
                    <Calendar className="h-4 w-4 mr-2" />
                    Booking History
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {userBookings.length > 0 ? (
                  <div className="space-y-3">
                    {userBookings.slice(0, 3).map((booking) => {
                      const parkingSpace = mockParkingSpaces.find(p => p.id === booking.parkingId);
                      return (
                        <div key={booking.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{parkingSpace?.name}</span>
                            <Badge variant={booking.status === 'active' ? 'success' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {booking.vehicleNumber}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(booking.startTime).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No bookings yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;