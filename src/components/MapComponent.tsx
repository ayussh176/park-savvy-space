import { useEffect, useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { ParkingSpace } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapComponentProps {
  parkingSpaces: ParkingSpace[];
  userLocation?: [number, number] | null;
}

export function MapComponent({ parkingSpaces, userLocation }: MapComponentProps) {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(userLocation || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (userLocation) {
      setCurrentLocation(userLocation);
    }
  }, [userLocation]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary-light to-accent-light rounded-lg">
      {/* Map Placeholder - For now showing a styled representation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Real-time parking availability map would be displayed here using Mapbox integration
          </p>
          <Button onClick={requestLocation} variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Get My Location
          </Button>
        </div>
      </div>

      {/* Parking Space Markers Simulation */}
      <div className="absolute inset-4">
        {parkingSpaces.slice(0, 6).map((space, index) => (
          <div
            key={space.id}
            className="absolute bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs font-medium shadow-lg transform hover:scale-110 transition-transform cursor-pointer"
            style={{
              left: `${20 + (index % 3) * 30}%`,
              top: `${20 + Math.floor(index / 3) * 40}%`,
            }}
          >
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {space.availableSlots}
            </div>
          </div>
        ))}
      </div>

      {/* User Location Marker */}
      {currentLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-accent border-2 border-accent-foreground rounded-full animate-pulse-soft"></div>
        </div>
      )}

      {/* Map Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Available Parking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}