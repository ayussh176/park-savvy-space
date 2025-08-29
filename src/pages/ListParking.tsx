import { useState } from 'react';
import { MapPin, Upload, Car, Bike, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ListParking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    useCurrentLocation: false,
    coordinates: { lat: 0, lng: 0 },
    vehicleTypes: [] as string[],
    parkingType: '',
    totalSlots: '',
    carSlots: '',
    bikeSlots: '',
    disabledSlots: '',
    pricePerHour: '',
    amenities: [] as string[],
    description: '',
    images: [] as File[]
  });

  const vehicleTypeOptions = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Bike', icon: Bike },
    { id: 'truck', label: 'Truck', icon: Truck }
  ];

  const parkingTypeOptions = [
    { value: 'open', label: 'Open Parking' },
    { value: 'covered', label: 'Covered Parking' },
    { value: 'underground', label: 'Underground Parking' },
    { value: 'free', label: 'Free Parking' },
    { value: 'paid', label: 'Paid Parking' }
  ];

  const amenityOptions = [
    'CCTV Security',
    'Security Guard',
    'Elevator',
    'Washroom',
    'EV Charging',
    'WiFi',
    'Wheelchair Access',
    'Car Wash',
    'Valet Service'
  ];

  const slotLayoutOptions = [
    { id: 'grid', name: 'Grid Layout', description: 'Organized in rows and columns' },
    { id: 'parallel', name: 'Parallel Layout', description: 'Side by side parking' },
    { id: 'angular', name: 'Angular Layout', description: 'Angled parking slots' },
    { id: 'mixed', name: 'Mixed Layout', description: 'Combination of layouts' }
  ];

  const handleVehicleTypeChange = (vehicleType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: checked 
        ? [...prev.vehicleTypes, vehicleType]
        : prev.vehicleTypes.filter(type => type !== vehicleType)
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            useCurrentLocation: true
          }));
          toast({
            title: "Location Captured",
            description: "Your current location has been set"
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.address || !formData.totalSlots || !formData.pricePerHour) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate submission
    toast({
      title: "Parking Space Listed!",
      description: "Your parking space has been successfully listed",
    });
    
    navigate('/owner');
  };

  const renderBasicInfo = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <p className="text-muted-foreground">Tell us about your parking space</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Parking Space Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Downtown Mall Parking"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            placeholder="Full address of your parking space"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>

        <div>
          <Label>Location</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
            {formData.useCurrentLocation && (
              <Badge variant="success">Location Set</Badge>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your parking space, special features, etc."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <Button onClick={() => setStep(2)} className="w-full" variant="hero">
          Next: Vehicle & Parking Type
        </Button>
      </CardContent>
    </Card>
  );

  const renderVehicleAndType = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Vehicle Types & Parking Type</CardTitle>
        <p className="text-muted-foreground">What vehicles can park here?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Allowed Vehicle Types *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            {vehicleTypeOptions.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center space-x-2">
                <Checkbox
                  id={vehicle.id}
                  checked={formData.vehicleTypes.includes(vehicle.id)}
                  onCheckedChange={(checked) => handleVehicleTypeChange(vehicle.id, checked as boolean)}
                />
                <Label htmlFor={vehicle.id} className="flex items-center gap-2">
                  <vehicle.icon className="h-4 w-4" />
                  {vehicle.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="parking-type">Parking Type *</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, parkingType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select parking type" />
            </SelectTrigger>
            <SelectContent>
              {parkingTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {amenityOptions.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button onClick={() => setStep(3)} className="flex-1" variant="hero">
            Next: Slots & Pricing
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSlotsAndPricing = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Slots & Pricing</CardTitle>
        <p className="text-muted-foreground">Configure your parking slots and pricing</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Slot Layout</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {slotLayoutOptions.map((layout) => (
              <div key={layout.id} className="p-3 border rounded-lg hover:border-primary cursor-pointer">
                <h4 className="font-medium">{layout.name}</h4>
                <p className="text-sm text-muted-foreground">{layout.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="total-slots">Total Slots *</Label>
            <Input
              id="total-slots"
              type="number"
              placeholder="50"
              value={formData.totalSlots}
              onChange={(e) => setFormData(prev => ({ ...prev, totalSlots: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="car-slots">Car Slots</Label>
            <Input
              id="car-slots"
              type="number"
              placeholder="40"
              value={formData.carSlots}
              onChange={(e) => setFormData(prev => ({ ...prev, carSlots: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="bike-slots">Bike Slots</Label>
            <Input
              id="bike-slots"
              type="number"
              placeholder="8"
              value={formData.bikeSlots}
              onChange={(e) => setFormData(prev => ({ ...prev, bikeSlots: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="disabled-slots">Disabled Slots</Label>
            <Input
              id="disabled-slots"
              type="number"
              placeholder="2"
              value={formData.disabledSlots}
              onChange={(e) => setFormData(prev => ({ ...prev, disabledSlots: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price per Hour (₹) *</Label>
          <Input
            id="price"
            type="number"
            placeholder="50"
            value={formData.pricePerHour}
            onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
          />
        </div>

        <div>
          <Label>Upload Images</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Drag & drop images or click to browse</p>
            <Button variant="outline" className="mt-2">
              Choose Files
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1" variant="hero">
            List Parking Space
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!user || user.type !== 'owner') {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in as an owner to list parking spaces</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">List Your Parking Space</h1>
          <p className="text-muted-foreground">Start earning by renting out your parking space</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-muted-foreground">
            <span className="text-center">
              {step === 1 && "Basic Information"}
              {step === 2 && "Vehicle & Type"}
              {step === 3 && "Slots & Pricing"}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {step === 1 && renderBasicInfo()}
          {step === 2 && renderVehicleAndType()}
          {step === 3 && renderSlotsAndPricing()}
        </div>
      </div>
    </div>
  );
};

export default ListParking;