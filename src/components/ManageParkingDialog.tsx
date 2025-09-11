import { useState } from 'react';
import { Settings, X, Power, PowerOff, DollarSign, Users, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ParkingSpace } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface ManageParkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace;
}

export function ManageParkingDialog({ open, onOpenChange, parkingSpace }: ManageParkingDialogProps) {
  const [isSpaceActive, setIsSpaceActive] = useState(true);
  const [pricePerHour, setPricePerHour] = useState(parkingSpace.pricePerHour);
  const [totalSlots, setTotalSlots] = useState(parkingSpace.totalSlots);
  const [operatingDays, setOperatingDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  });

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your parking space settings have been updated successfully."
    });
    onOpenChange(false);
  };

  const handleSlotToggle = (slotId: string, enabled: boolean) => {
    toast({
      title: enabled ? "Slot Enabled" : "Slot Disabled",
      description: `Slot has been ${enabled ? 'enabled' : 'disabled'} successfully.`
    });
  };

  const renderSlotManagement = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price per Hour (₹)</Label>
          <Input
            id="price"
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="slots">Total Slots</Label>
          <Input
            id="slots"
            type="number"
            value={totalSlots}
            onChange={(e) => setTotalSlots(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Individual Slot Control</h4>
        <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
          {parkingSpace.slots.slice(0, 20).map((slot) => (
            <Card key={slot.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{slot.slotNumber}</p>
                  <Badge variant={slot.status === 'available' ? 'success' : 'secondary'} className="text-xs">
                    {slot.status}
                  </Badge>
                </div>
                <Switch
                  checked={slot.status === 'available'}
                  onCheckedChange={(checked) => handleSlotToggle(slot.id, checked)}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOperatingHours = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <Power className="h-5 w-5" />
          <div>
            <p className="font-medium">Parking Space Status</p>
            <p className="text-sm text-muted-foreground">
              {isSpaceActive ? 'Currently accepting bookings' : 'Temporarily closed'}
            </p>
          </div>
        </div>
        <Switch
          checked={isSpaceActive}
          onCheckedChange={setIsSpaceActive}
        />
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Operating Days</h4>
        {Object.entries(operatingDays).map(([day, enabled]) => (
          <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{day}</span>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => 
                setOperatingDays(prev => ({ ...prev, [day]: checked }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Bookings</p>
                <p className="text-lg font-bold">{parkingSpace.totalSlots - parkingSpace.availableSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-lg font-bold">₹{(parkingSpace.totalSlots - parkingSpace.availableSlots) * parkingSpace.pricePerHour}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Slot A5 booked for 2 hours</span>
              <span className="text-muted-foreground ml-auto">2min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Slot B3 payment completed</span>
              <span className="text-muted-foreground ml-auto">15min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Slot C1 became available</span>
              <span className="text-muted-foreground ml-auto">1hr ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage {parkingSpace.name}
          </DialogTitle>
          <DialogDescription>
            Control your parking space settings, slots, and operating hours
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="slots" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="slots">Slots & Pricing</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="slots" className="space-y-4">
            {renderSlotManagement()}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            {renderOperatingHours()}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {renderAnalytics()}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}