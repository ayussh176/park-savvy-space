import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Shield, Car, Wifi, Camera, Zap, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { mockParkingSpaces } from '@/data/mockData';

const ParkingDetails = () => {
  const { id } = useParams();
  const parkingSpace = mockParkingSpaces.find(space => space.id === id);

  if (!parkingSpace) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Parking Space Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    'CCTV': Camera,
    'Security': Shield,
    'Elevator': Car,
    'Washroom': Building,
    'EV Charging': Zap,
    'WiFi': Wifi,
    'Wheelchair Access': Car
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span>Parking Details</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{parkingSpace.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <span className="font-medium">{parkingSpace.rating}</span>
              <span className="text-muted-foreground">(124 reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{parkingSpace.address}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-card rounded-lg flex items-center justify-center">
                  <Car className="h-24 w-24 text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Parking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{parkingSpace.totalSlots}</p>
                    <p className="text-sm text-muted-foreground">Total Slots</p>
                  </div>
                  <div className="text-center p-4 bg-success-light rounded-lg">
                    <p className="text-2xl font-bold text-success">{parkingSpace.availableSlots}</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                  <div className="text-center p-4 bg-primary-light rounded-lg">
                    <p className="text-2xl font-bold text-primary">₹{parkingSpace.pricePerHour}</p>
                    <p className="text-sm text-muted-foreground">Per Hour</p>
                  </div>
                  <div className="text-center p-4 bg-accent-light rounded-lg">
                    <p className="text-2xl font-bold text-accent">{parkingSpace.distance}km</p>
                    <p className="text-sm text-muted-foreground">Distance</p>
                  </div>
                </div>

                {/* Type and Vehicles */}
                <div>
                  <h3 className="font-semibold mb-3">Parking Information</h3>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize">
                      {parkingSpace.type} Parking
                    </Badge>
                    {parkingSpace.vehicleTypes.map(type => (
                      <Badge key={type} variant="outline" className="capitalize">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {parkingSpace.amenities.map((amenity) => {
                      const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Shield;
                      return (
                        <div key={amenity} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Owner Info */}
                <div>
                  <h3 className="font-semibold mb-3">Owner Information</h3>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="font-medium">{parkingSpace.owner.name}</p>
                    <p className="text-muted-foreground text-sm">{parkingSpace.owner.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive map would be shown here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="shadow-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book This Space</span>
                  <Badge variant="success">Available</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">₹{parkingSpace.pricePerHour}</p>
                  <p className="text-muted-foreground">per hour</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Available Slots:</span>
                    <span className="font-medium text-success">{parkingSpace.availableSlots}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Distance:</span>
                    <span className="font-medium">{parkingSpace.distance}km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-medium">{parkingSpace.rating}</span>
                    </div>
                  </div>
                </div>

                <Button asChild variant="hero" size="lg" className="w-full">
                  <Link to={`/book/${parkingSpace.id}`}>
                    Book Now
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Instant booking confirmation
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Secure & monitored</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>24/7 access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-accent" />
                  <span>All vehicle types</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetails;