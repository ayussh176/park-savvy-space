from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

User = get_user_model()

class ParkingSpace(models.Model):
    """Model for parking spaces/lots"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parking_spaces')
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    daily_rate = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))], null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Amenities
    has_security = models.BooleanField(default=False)
    has_covered_parking = models.BooleanField(default=False)
    has_ev_charging = models.BooleanField(default=False)
    has_disability_access = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
        
    @property
    def total_slots(self):
        return self.parking_slots.count()
        
    @property
    def available_slots(self):
        return self.parking_slots.filter(is_available=True).count()

class ParkingSlot(models.Model):
    """Model for individual parking slots within a parking space"""
    SLOT_TYPES = [
        ('standard', 'Standard'),
        ('compact', 'Compact'),
        ('large', 'Large/SUV'),
        ('motorcycle', 'Motorcycle'),
        ('disabled', 'Disability Access'),
        ('ev', 'Electric Vehicle'),
    ]
    
    parking_space = models.ForeignKey(ParkingSpace, on_delete=models.CASCADE, related_name='parking_slots')
    slot_number = models.CharField(max_length=20)
    slot_type = models.CharField(max_length=20, choices=SLOT_TYPES, default='standard')
    is_available = models.BooleanField(default=True)
    is_reserved = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['slot_number']
        unique_together = ['parking_space', 'slot_number']
        
    def __str__(self):
        return f"{self.parking_space.name} - Slot {self.slot_number}"

class Booking(models.Model):
    """Model for parking bookings"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    parking_slot = models.ForeignKey(ParkingSlot, on_delete=models.CASCADE, related_name='bookings')
    vehicle_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=50, default='car')
    
    # Booking timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    
    # Pricing
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booking_reference = models.CharField(max_length=20, unique=True)
    special_instructions = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Booking {self.booking_reference} - {self.user.username}"
        
    def save(self, *args, **kwargs):
        if not self.booking_reference:
            import uuid
            self.booking_reference = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)
        
    @property
    def duration_hours(self):
        """Calculate booking duration in hours"""
        duration = self.end_time - self.start_time
        return duration.total_seconds() / 3600
        
    @property
    def is_active(self):
        """Check if booking is currently active"""
        from django.utils import timezone
        now = timezone.now()
        return (self.status in ['confirmed', 'active'] and 
                self.start_time <= now <= self.end_time)
