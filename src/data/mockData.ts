export type ParkingSpace = {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: 'free' | 'paid' | 'open' | 'underground' | 'covered';
  category: 'commercial' | 'free' | 'private';
  vehicleTypes: string[];
  pricePerHour: number;
  totalSlots: number;
  availableSlots: number;
  rating: number;
  distance: number;
  image: string;
  amenities: string[];
  owner: {
    id: string;
    name: string;
    phone: string;
  };
  slots: ParkingSlot[];
};

export type ParkingSlot = {
  id: string;
  slotNumber: string;
  type: 'car' | 'bike' | 'disabled';
  status: 'available' | 'booked' | 'occupied' | 'maintenance';
  pricePerHour: number;
  bookings?: Booking[];
};

export type Booking = {
  id: string;
  userId: string;
  parkingId: string;
  slotId: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
};

export const mockParkingSpaces: ParkingSpace[] = [
  {
    id: '1',
    name: 'Central Mall Parking',
    address: '123 Main Street, Downtown',
    coordinates: [77.2090, 28.6139],
    type: 'covered',
    category: 'commercial',
    vehicleTypes: ['car', 'bike'],
    pricePerHour: 50,
    totalSlots: 100,
    availableSlots: 25,
    rating: 4.5,
    distance: 0.5,
    image: '/api/placeholder/400/300',
    amenities: ['CCTV', 'Security', 'Elevator', 'Washroom'],
    owner: {
      id: 'owner1',
      name: 'John Doe',
      phone: '+91 9876543210'
    },
    slots: Array.from({ length: 100 }, (_, i) => ({
      id: `slot-${i + 1}`,
      slotNumber: `A${i + 1}`,
      type: i < 80 ? 'car' : i < 95 ? 'bike' : 'disabled',
      status: Math.random() > 0.7 ? 'booked' : 'available',
      pricePerHour: i < 80 ? 50 : i < 95 ? 20 : 50,
    }))
  },
  {
    id: '2',
    name: 'Metro Station Parking',
    address: '456 Metro Road, Business District',
    coordinates: [77.2167, 28.6167],
    type: 'underground',
    category: 'commercial',
    vehicleTypes: ['car', 'bike'],
    pricePerHour: 30,
    totalSlots: 200,
    availableSlots: 89,
    rating: 4.2,
    distance: 1.2,
    image: '/api/placeholder/400/300',
    amenities: ['CCTV', 'Security', 'EV Charging'],
    owner: {
      id: 'owner2',
      name: 'Jane Smith',
      phone: '+91 9876543211'
    },
    slots: Array.from({ length: 200 }, (_, i) => ({
      id: `slot-${i + 1}`,
      slotNumber: `B${i + 1}`,
      type: i < 150 ? 'car' : i < 190 ? 'bike' : 'disabled',
      status: Math.random() > 0.6 ? 'booked' : 'available',
      pricePerHour: i < 150 ? 30 : i < 190 ? 15 : 30,
    }))
  },
  {
    id: '3',
    name: 'Hospital Parking',
    address: '789 Health Avenue, Medical District',
    coordinates: [77.2200, 28.6100],
    type: 'open',
    category: 'free',
    vehicleTypes: ['car', 'bike'],
    pricePerHour: 40,
    totalSlots: 150,
    availableSlots: 67,
    rating: 4.0,
    distance: 2.1,
    image: '/api/placeholder/400/300',
    amenities: ['CCTV', 'Security', 'Wheelchair Access'],
    owner: {
      id: 'owner3',
      name: 'Medical Corp',
      phone: '+91 9876543212'
    },
    slots: Array.from({ length: 150 }, (_, i) => ({
      id: `slot-${i + 1}`,
      slotNumber: `C${i + 1}`,
      type: i < 120 ? 'car' : i < 140 ? 'bike' : 'disabled',
      status: Math.random() > 0.5 ? 'booked' : 'available',
      pricePerHour: i < 120 ? 40 : i < 140 ? 20 : 40,
    }))
  },
  {
    id: '4',
    name: 'Residential Private Space',
    address: '15 Green Valley, Sector 12',
    coordinates: [77.2150, 28.6080],
    type: 'open',
    category: 'private',
    vehicleTypes: ['car'],
    pricePerHour: 25,
    totalSlots: 5,
    availableSlots: 3,
    rating: 4.3,
    distance: 0.8,
    image: '/api/placeholder/400/300',
    amenities: ['CCTV', 'Gated'],
    owner: {
      id: 'owner4',
      name: 'Private Owner',
      phone: '+91 9876543213'
    },
    slots: Array.from({ length: 5 }, (_, i) => ({
      id: `slot-${i + 1}`,
      slotNumber: `P${i + 1}`,
      type: 'car',
      status: Math.random() > 0.4 ? 'available' : 'booked',
      pricePerHour: 25,
    }))
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    userId: 'user1',
    parkingId: '1',
    slotId: 'slot-1',
    vehicleNumber: 'DL01AB1234',
    startTime: '2024-01-20T10:00:00Z',
    endTime: '2024-01-20T12:00:00Z',
    duration: 2,
    totalAmount: 100,
    status: 'active',
    paymentStatus: 'paid'
  },
  {
    id: 'booking2',
    userId: 'user1',
    parkingId: '2',
    slotId: 'slot-25',
    vehicleNumber: 'DL01CD5678',
    startTime: '2024-01-19T14:00:00Z',
    endTime: '2024-01-19T16:00:00Z',
    duration: 2,
    totalAmount: 60,
    status: 'completed',
    paymentStatus: 'paid'
  }
];