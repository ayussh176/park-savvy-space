import { useState } from 'react';
import { Edit, MapPin, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ParkingSpace } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface EditParkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace;
}

export function EditParkingDialog({ open, onOpenChange, parkingSpace }: EditParkingDialogProps) {
  const [formData, setFormData] = useState({
    name: parkingSpace.name,
    address: parkingSpace.address,
    description: '',
    type: parkingSpace.type,
    category: parkingSpace.category,
    pricePerHour: parkingSpace.pricePerHour,
    totalSlots: parkingSpace.totalSlots,
    amenities: parkingSpace.amenities.join(', ')
  });

  const handleSave = () => {
    // In a real app, this would make an API call to update the parking space
    toast({
      title: "Parking Space Updated",
      description: `${formData.name} has been updated successfully.`
    });
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Parking Space
          </DialogTitle>
          <DialogDescription>
            Update your parking space information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Parking Space Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Central Mall Parking"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Full address of the parking space"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your parking space..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Parking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Parking Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Parking Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="covered">Covered</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price per Hour (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.pricePerHour}
                  onChange={(e) => handleInputChange('pricePerHour', Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="slots">Total Slots</Label>
                <Input
                  id="slots"
                  type="number"
                  min="1"
                  value={formData.totalSlots}
                  onChange={(e) => handleInputChange('totalSlots', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => handleInputChange('amenities', e.target.value)}
                placeholder="e.g., CCTV, Security, 24/7 Access, EV Charging"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}