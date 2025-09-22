import { useState } from 'react';
import { Search, MapPin, Star, Clock, Shield, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { mockParkingSpaces } from '@/data/mockData';
import { Header } from '@/components/Header';
import { MapComponent } from '@/components/MapComponent';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const filteredParkingSpaces = mockParkingSpaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation([position.coords.longitude, position.coords.latitude]);
          // Scroll to parking spaces section
          const parkingSection = document.getElementById('parking-spaces-section');
          if (parkingSection) {
            parkingSection.scrollIntoView({ behavior: 'smooth' });
          }
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
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Find & Book Parking Slots Instantly
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Book parking spaces near you with real-time availability. Safe, secure, and convenient parking solutions.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-background/10 backdrop-blur-sm rounded-xl p-6 shadow-elevated">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for parking areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/80 border-primary/20"
                />
              </div>
              <Button
                onClick={handleLocationSelect}
                variant="secondary"
                className="bg-background/80 text-foreground hover:bg-background"
              >
                <MapPin className="h-4 w-4" />
                Current Location
              </Button>
              <Button variant="hero" size="lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Parking Spaces Near You
          </h2>
          <div className="h-96 rounded-xl overflow-hidden shadow-card bg-muted">
            <MapComponent 
              parkingSpaces={filteredParkingSpaces}
              userLocation={selectedLocation}
            />
          </div>
        </div>
      </section>

      {/* Recommended Parking Spaces */}
      <section id="parking-spaces-section" className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Recommended Parking Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParkingSpaces.map((space) => (
              <Card key={space.id} className="group hover:shadow-elevated transition-all duration-300 transform hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="aspect-video bg-gradient-card rounded-lg mb-4 flex items-center justify-center">
                    <Car className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg">{space.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">{space.rating}</span>
                    </div>
                  </CardTitle>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {space.address}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary">₹{space.pricePerHour}</p>
                      <p className="text-sm text-muted-foreground">per hour</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-success">{space.availableSlots}</p>
                      <p className="text-sm text-muted-foreground">slots available</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize">
                      {space.type}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {space.distance}km away
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {space.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/parking/${space.id}`}>View Details</Link>
                    </Button>
                    <Button asChild variant="hero" className="flex-1">
                      <Link to={`/book/${space.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">All parking spaces are verified and monitored with CCTV security.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
              <p className="text-muted-foreground">Get live updates on available parking slots in your area.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Navigation</h3>
              <p className="text-muted-foreground">Get turn-by-turn directions to your booked parking space.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;