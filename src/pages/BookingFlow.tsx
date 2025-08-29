import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Car, CreditCard, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { LoginDialog } from '@/components/LoginDialog';
import { mockParkingSpaces } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const BookingFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    slotId: '',
    vehicleNumber: '',
    date: '',
    startTime: '',
    duration: '',
    totalAmount: 0
  });

  const parkingSpace = mockParkingSpaces.find(space => space.id === id);

  if (!parkingSpace) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Parking Space Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const availableSlots = parkingSpace.slots.filter(slot => slot.status === 'available');

  const calculateTotal = () => {
    const duration = parseInt(bookingData.duration) || 0;
    const amount = duration * parkingSpace.pricePerHour;
    setBookingData(prev => ({ ...prev, totalAmount: amount }));
  };

  const handleSlotSelection = (slotId: string) => {
    setBookingData(prev => ({ ...prev, slotId }));
    setStep(2);
  };

  const handleBookingDetails = () => {
    if (!bookingData.vehicleNumber || !bookingData.date || !bookingData.startTime || !bookingData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all booking details",
        variant: "destructive"
      });
      return;
    }
    
    calculateTotal();
    
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    
    setStep(3);
  };

  const handlePayment = () => {
    // Simulate payment processing
    toast({
      title: "Booking Confirmed!",
      description: `Your parking slot has been booked at ${parkingSpace.name}`,
      variant: "default"
    });
    
    navigate('/customer');
  };

  const renderSlotSelection = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Select a Parking Slot</CardTitle>
        <p className="text-muted-foreground">Choose from {availableSlots.length} available slots</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {availableSlots.slice(0, 32).map((slot) => (
            <Button
              key={slot.id}
              variant={slot.status === 'available' ? 'outline' : 'secondary'}
              className="h-12 text-xs"
              disabled={slot.status !== 'available'}
              onClick={() => handleSlotSelection(slot.id)}
            >
              {slot.slotNumber}
            </Button>
          ))}
        </div>
        
        <div className="mt-6 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded"></div>
            <span>Reserved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBookingDetails = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
        <p className="text-muted-foreground">Fill in your booking information</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="vehicle-number">Vehicle Number</Label>
          <Input
            id="vehicle-number"
            placeholder="e.g., DL01AB1234"
            value={bookingData.vehicleNumber}
            onChange={(e) => setBookingData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={bookingData.startTime}
              onChange={(e) => setBookingData(prev => ({ ...prev, startTime: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Duration (hours)</Label>
          <Select onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="2">2 hours</SelectItem>
              <SelectItem value="3">3 hours</SelectItem>
              <SelectItem value="4">4 hours</SelectItem>
              <SelectItem value="6">6 hours</SelectItem>
              <SelectItem value="8">8 hours</SelectItem>
              <SelectItem value="12">12 hours</SelectItem>
              <SelectItem value="24">24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button variant="hero" onClick={handleBookingDetails} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentSummary = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
        <p className="text-muted-foreground">Review your booking before payment</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Parking Space:</span>
            <span className="font-medium">{parkingSpace.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Slot Number:</span>
            <span className="font-medium">
              {parkingSpace.slots.find(s => s.id === bookingData.slotId)?.slotNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Vehicle:</span>
            <span className="font-medium">{bookingData.vehicleNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span className="font-medium">{bookingData.date} at {bookingData.startTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{bookingData.duration} hours</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span className="text-primary">₹{bookingData.totalAmount}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
            Back
          </Button>
          <Button variant="hero" onClick={handlePayment} className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            Pay ₹{bookingData.totalAmount}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Parking Slot</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{parkingSpace.name} - {parkingSpace.address}</span>
          </div>
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
              {step === 1 && "Select Slot"}
              {step === 2 && "Booking Details"}
              {step === 3 && "Payment"}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {step === 1 && renderSlotSelection()}
          {step === 2 && renderBookingDetails()}
          {step === 3 && renderPaymentSummary()}
        </div>
      </div>

      <LoginDialog 
        open={showLogin} 
        onOpenChange={setShowLogin} 
      />
    </div>
  );
};

export default BookingFlow;