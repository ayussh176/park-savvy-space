import { useState } from 'react';
import { Car, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Vehicle {
  id: string;
  type: 'Car' | 'Bike' | 'SUV';
  number: string;
  model: string;
  color?: string;
}

interface VehicleManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleManagementDialog({ open, onOpenChange }: VehicleManagementDialogProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', type: 'Car', number: 'DL01AB1234', model: 'Honda City', color: 'White' },
    { id: '2', type: 'Bike', number: 'DL01CD5678', model: 'Honda Activa', color: 'Black' }
  ]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    number: '',
    model: '',
    color: ''
  });

  const handleAdd = () => {
    if (!formData.type || !formData.number || !formData.model) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: formData.type as Vehicle['type'],
      number: formData.number.toUpperCase(),
      model: formData.model,
      color: formData.color
    };

    setVehicles(prev => [...prev, newVehicle]);
    setFormData({ type: '', number: '', model: '', color: '' });
    setShowAddForm(false);
    toast({
      title: "Vehicle Added",
      description: "Your vehicle has been added successfully"
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      type: vehicle.type,
      number: vehicle.number,
      model: vehicle.model,
      color: vehicle.color || ''
    });
  };

  const handleUpdate = (id: string) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id 
        ? {
            ...vehicle,
            type: formData.type as Vehicle['type'],
            number: formData.number.toUpperCase(),
            model: formData.model,
            color: formData.color
          }
        : vehicle
    ));
    setEditingId(null);
    setFormData({ type: '', number: '', model: '', color: '' });
    toast({
      title: "Vehicle Updated",
      description: "Your vehicle information has been updated"
    });
  };

  const handleDelete = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    toast({
      title: "Vehicle Removed",
      description: "Your vehicle has been removed from the list"
    });
  };

  const renderVehicleForm = (isEditing = false, vehicleId?: string) => (
    <Card className="border-2 border-dashed border-primary/30">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicle-type">Vehicle Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bike">Bike</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="vehicle-number">Vehicle Number</Label>
            <Input
              id="vehicle-number"
              placeholder="DL01AB1234"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicle-model">Model</Label>
            <Input
              id="vehicle-model"
              placeholder="Honda City"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="vehicle-color">Color (Optional)</Label>
            <Input
              id="vehicle-color"
              placeholder="White"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={() => handleUpdate(vehicleId!)} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ type: '', number: '', model: '', color: '' });
              }}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAdd} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddForm(false);
                setFormData({ type: '', number: '', model: '', color: '' });
              }}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            My Vehicles
          </DialogTitle>
          <DialogDescription>
            Add, modify, or delete your vehicles for easier booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Vehicle Button */}
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)} 
              variant="outline" 
              className="w-full border-dashed border-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Vehicle
            </Button>
          )}

          {/* Add Form */}
          {showAddForm && renderVehicleForm()}

          {/* Vehicle List */}
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border hover:shadow-elevated transition-all duration-300">
                {editingId === vehicle.id ? (
                  renderVehicleForm(true, vehicle.id)
                ) : (
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{vehicle.number}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.model} {vehicle.color && `• ${vehicle.color}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{vehicle.type}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {vehicles.length === 0 && !showAddForm && (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vehicles added yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}