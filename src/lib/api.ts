// API Service Layer for Park Savvy Space
const API_BASE_URL = 'http://localhost:8000/api';

// Type definitions matching the backend models
export interface ParkingSpace {
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
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  type: 'car' | 'bike' | 'disabled';
  status: 'available' | 'booked' | 'occupied' | 'maintenance';
  pricePerHour: number;
  bookings?: Booking[];
}

export interface Booking {
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
}

// Utility function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Utility function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  const errorData = await response.json().catch(() => ({ message: 'Network error' }));
  throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
};

// API Functions
export const parkingAPI = {
  // Get all parking spaces
  async getAllSpaces(): Promise<ParkingSpace[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/spaces/`);
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch parking spaces:', error);
      throw error;
    }
  },

  // Get parking space by ID
  async getSpaceById(id: string): Promise<ParkingSpace> {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/spaces/${id}/`);
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch parking space ${id}:`, error);
      throw error;
    }
  },

  // Search parking spaces
  async searchSpaces(query?: string): Promise<ParkingSpace[]> {
    try {
      const params = query ? `?search=${encodeURIComponent(query)}` : '';
      const response = await fetch(`${API_BASE_URL}/parking/search/${params}`);
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to search parking spaces:', error);
      throw error;
    }
  },

  // Get user bookings
  async getUserBookings(): Promise<Booking[]> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/parking/reservations/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch user bookings:', error);
      throw error;
    }
  },

  // Create booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus'>): Promise<Booking> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/parking/reservations/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  },

  // Update booking
  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/parking/reservations/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to update booking ${id}:`, error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<void> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/parking/reservations/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error(`Failed to cancel booking ${id}:`, error);
      throw error;
    }
  },
};

// Authentication API
export const authAPI = {
  // User login
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        await handleApiError(response);
      }
      const data = await response.json();
      // Store token in localStorage
      localStorage.setItem('authToken', data.access);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // User registration
  async register(userData: { email: string; password: string; name: string; phone?: string }): Promise<{ user: any; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        await handleApiError(response);
      }
      const data = await response.json();
      // Store token in localStorage
      localStorage.setItem('authToken', data.access);
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile(): Promise<any> {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        await handleApiError(response);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
  },
};
