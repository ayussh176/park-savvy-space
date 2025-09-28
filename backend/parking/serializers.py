from rest_framework import serializers
from .models import ParkingSpace, ParkingSlot, Booking
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.utils import timezone

User = get_user_model()

class ParkingSlotSerializer(serializers.ModelSerializer):
    """Serializer for ParkingSlot model"""
    
    class Meta:
        model = ParkingSlot
        fields = ['id', 'slot_number', 'slot_type', 'is_available', 'is_reserved', 'notes']
        read_only_fields = ['id']

class ParkingSpaceSerializer(serializers.ModelSerializer):
    """Serializer for ParkingSpace model with basic information"""
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    total_slots = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()
    
    class Meta:
        model = ParkingSpace
        fields = [
            'id', 'name', 'description', 'address', 'latitude', 'longitude',
            'owner', 'owner_name', 'hourly_rate', 'daily_rate', 'is_active',
            'has_security', 'has_covered_parking', 'has_ev_charging', 'has_disability_access',
            'total_slots', 'available_slots', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class ParkingSpaceDetailSerializer(ParkingSpaceSerializer):
    """Detailed serializer for ParkingSpace with parking slots"""
    parking_slots = ParkingSlotSerializer(many=True, read_only=True)
    
    class Meta(ParkingSpaceSerializer.Meta):
        fields = ParkingSpaceSerializer.Meta.fields + ['parking_slots']

class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    parking_space_name = serializers.CharField(source='parking_slot.parking_space.name', read_only=True)
    slot_number = serializers.CharField(source='parking_slot.slot_number', read_only=True)
    duration_hours = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_name', 'parking_slot', 'parking_space_name', 'slot_number',
            'vehicle_number', 'vehicle_type', 'start_time', 'end_time',
            'actual_start_time', 'actual_end_time', 'hourly_rate', 'total_amount',
            'paid_amount', 'status', 'booking_reference', 'special_instructions',
            'duration_hours', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'booking_reference', 'hourly_rate', 'total_amount', 'created_at', 'updated_at'
        ]
        
    def validate(self, data):
        """Validate booking data"""
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        parking_slot = data.get('parking_slot')
        
        # Validate time range
        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError("End time must be after start time")
            
            if start_time < timezone.now():
                raise serializers.ValidationError("Start time cannot be in the past")
        
        # Check slot availability
        if parking_slot:
            if not parking_slot.is_available:
                raise serializers.ValidationError("Selected parking slot is not available")
            
            # Check for overlapping bookings
            overlapping_bookings = Booking.objects.filter(
                parking_slot=parking_slot,
                status__in=['confirmed', 'active'],
                start_time__lt=end_time,
                end_time__gt=start_time
            )
            
            if self.instance:
                overlapping_bookings = overlapping_bookings.exclude(pk=self.instance.pk)
            
            if overlapping_bookings.exists():
                raise serializers.ValidationError(
                    "Parking slot is already booked for the selected time period"
                )
        
        return data
        
    def create(self, validated_data):
        """Create booking with calculated pricing"""
        validated_data['user'] = self.context['request'].user
        
        # Calculate pricing
        start_time = validated_data['start_time']
        end_time = validated_data['end_time']
        parking_slot = validated_data['parking_slot']
        
        duration = end_time - start_time
        hours = duration.total_seconds() / 3600
        
        hourly_rate = parking_slot.parking_space.hourly_rate
        total_amount = Decimal(str(hours)) * hourly_rate
        
        validated_data['hourly_rate'] = hourly_rate
        validated_data['total_amount'] = total_amount
        
        return super().create(validated_data)

class BookingCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for booking creation"""
    
    class Meta:
        model = Booking
        fields = [
            'parking_slot', 'vehicle_number', 'vehicle_type', 
            'start_time', 'end_time', 'special_instructions'
        ]
        
    def validate(self, data):
        """Validate booking creation data"""
        return BookingSerializer().validate(data)
        
    def create(self, validated_data):
        """Create booking using main serializer"""
        serializer = BookingSerializer(context=self.context)
        return serializer.create(validated_data)

class ParkingSearchSerializer(serializers.Serializer):
    """Serializer for parking search parameters"""
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    radius = serializers.FloatField(default=5.0, min_value=0.1, max_value=50.0)
    start_time = serializers.DateTimeField(required=False)
    end_time = serializers.DateTimeField(required=False)
    slot_type = serializers.CharField(required=False)
    max_hourly_rate = serializers.DecimalField(max_digits=8, decimal_places=2, required=False)
    amenities = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    
    def validate(self, data):
        """Validate search parameters"""
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError("End time must be after start time")
                
        if (data.get('latitude') is None) != (data.get('longitude') is None):
            raise serializers.ValidationError(
                "Both latitude and longitude must be provided for location-based search"
            )
            
        return data

class ParkingSpaceStatsSerializer(serializers.Serializer):
    """Serializer for parking space statistics"""
    total_bookings = serializers.IntegerField()
    active_bookings = serializers.IntegerField()
    today_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    monthly_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    occupancy_rate = serializers.FloatField()
    
class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_spaces = serializers.IntegerField()
    total_slots = serializers.IntegerField()
    available_slots = serializers.IntegerField()
    active_bookings = serializers.IntegerField()
    today_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
