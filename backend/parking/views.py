from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from decimal import Decimal
from datetime import datetime, timedelta
import math

from .models import ParkingSpace, ParkingSlot, Booking
from .serializers import (
    ParkingSpaceSerializer, ParkingSpaceDetailSerializer,
    ParkingSlotSerializer, BookingSerializer, BookingCreateSerializer,
    ParkingSearchSerializer, ParkingSpaceStatsSerializer,
    DashboardStatsSerializer
)
from .permissions import IsOwnerOrReadOnly, IsBookingOwnerOrParkingOwner

class ParkingSpaceViewSet(viewsets.ModelViewSet):
    """ViewSet for managing parking spaces"""
    serializer_class = ParkingSpaceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return parking spaces based on user permissions"""
        if self.action in ['list', 'retrieve']:
            return ParkingSpace.objects.filter(is_active=True)
        return ParkingSpace.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return ParkingSpaceDetailSerializer
        return ParkingSpaceSerializer
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get statistics for a specific parking space"""
        parking_space = self.get_object()
        
        # Calculate stats
        total_bookings = parking_space.parking_slots.aggregate(
            count=Count('bookings')
        )['count']
        
        active_bookings = Booking.objects.filter(
            parking_slot__parking_space=parking_space,
            status__in=['confirmed', 'active']
        ).count()
        
        today = timezone.now().date()
        today_bookings = Booking.objects.filter(
            parking_slot__parking_space=parking_space,
            start_time__date=today
        ).count()
        
        total_revenue = Booking.objects.filter(
            parking_slot__parking_space=parking_space,
            status='completed'
        ).aggregate(Sum('paid_amount'))['paid_amount__sum'] or Decimal('0.00')
        
        this_month = timezone.now().replace(day=1)
        monthly_revenue = Booking.objects.filter(
            parking_slot__parking_space=parking_space,
            status='completed',
            created_at__gte=this_month
        ).aggregate(Sum('paid_amount'))['paid_amount__sum'] or Decimal('0.00')
        
        # Calculate occupancy rate
        total_slots = parking_space.total_slots
        occupancy_rate = (active_bookings / total_slots * 100) if total_slots > 0 else 0
        
        stats_data = {
            'total_bookings': total_bookings,
            'active_bookings': active_bookings,
            'today_bookings': today_bookings,
            'total_revenue': total_revenue,
            'monthly_revenue': monthly_revenue,
            'occupancy_rate': round(occupancy_rate, 2)
        }
        
        serializer = ParkingSpaceStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_slots(self, request, pk=None):
        """Add parking slots to a parking space"""
        parking_space = self.get_object()
        slots_data = request.data.get('slots', [])
        
        created_slots = []
        for slot_data in slots_data:
            slot_data['parking_space'] = parking_space.id
            serializer = ParkingSlotSerializer(data=slot_data)
            if serializer.is_valid():
                slot = serializer.save()
                created_slots.append(slot)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ParkingSlotSerializer(created_slots, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ParkingSlotViewSet(viewsets.ModelViewSet):
    """ViewSet for managing parking slots"""
    serializer_class = ParkingSlotSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """Return parking slots based on permissions"""
        parking_space_id = self.request.query_params.get('parking_space')
        queryset = ParkingSlot.objects.all()
        
        if parking_space_id:
            queryset = queryset.filter(parking_space_id=parking_space_id)
            
        return queryset
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Check availability of a parking slot"""
        slot = self.get_object()
        start_time = request.query_params.get('start_time')
        end_time = request.query_params.get('end_time')
        
        if not start_time or not end_time:
            return Response(
                {'error': 'start_time and end_time parameters required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        except ValueError:
            return Response(
                {'error': 'Invalid datetime format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for overlapping bookings
        overlapping = Booking.objects.filter(
            parking_slot=slot,
            status__in=['confirmed', 'active'],
            start_time__lt=end_dt,
            end_time__gt=start_dt
        ).exists()
        
        return Response({
            'available': not overlapping and slot.is_available,
            'slot_id': slot.id,
            'slot_number': slot.slot_number
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_parking(request):
    """Search for available parking spaces"""
    serializer = ParkingSearchSerializer(data=request.GET)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    queryset = ParkingSpace.objects.filter(is_active=True)
    
    # Location-based filtering
    if data.get('latitude') and data.get('longitude'):
        lat = float(data['latitude'])
        lng = float(data['longitude'])
        radius = data.get('radius', 5.0)
        
        # Calculate distance using Haversine formula approximation
        lat_range = radius / 111.0  # 1 degree latitude ≈ 111 km
        lng_range = radius / (111.0 * math.cos(math.radians(lat)))
        
        queryset = queryset.filter(
            latitude__range=[lat - lat_range, lat + lat_range],
            longitude__range=[lng - lng_range, lng + lng_range]
        )
    
    # Price filtering
    if data.get('max_hourly_rate'):
        queryset = queryset.filter(hourly_rate__lte=data['max_hourly_rate'])
    
    # Amenities filtering
    amenities = data.get('amenities', [])
    if 'security' in amenities:
        queryset = queryset.filter(has_security=True)
    if 'covered' in amenities:
        queryset = queryset.filter(has_covered_parking=True)
    if 'ev_charging' in amenities:
        queryset = queryset.filter(has_ev_charging=True)
    if 'disability_access' in amenities:
        queryset = queryset.filter(has_disability_access=True)
    
    # Time-based availability filtering
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    slot_type = data.get('slot_type')
    
    if start_time and end_time:
        # Find spaces with available slots during the requested time
        available_spaces = []
        for space in queryset:
            slots_query = space.parking_slots.filter(is_available=True)
            if slot_type:
                slots_query = slots_query.filter(slot_type=slot_type)
            
            for slot in slots_query:
                overlapping = Booking.objects.filter(
                    parking_slot=slot,
                    status__in=['confirmed', 'active'],
                    start_time__lt=end_time,
                    end_time__gt=start_time
                ).exists()
                
                if not overlapping:
                    available_spaces.append(space)
                    break
        
        queryset = queryset.filter(id__in=[s.id for s in available_spaces])
    
    serializer = ParkingSpaceSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def map_data(request):
    """Get parking spaces data for map display"""
    bounds = request.GET.get('bounds', '').split(',')
    
    queryset = ParkingSpace.objects.filter(is_active=True)
    
    if len(bounds) == 4:
        try:
            south, west, north, east = map(float, bounds)
            queryset = queryset.filter(
                latitude__range=[south, north],
                longitude__range=[west, east]
            )
        except ValueError:
            pass
    
    # Return simplified data for map markers
    map_data = []
    for space in queryset:
        map_data.append({
            'id': space.id,
            'name': space.name,
            'latitude': float(space.latitude),
            'longitude': float(space.longitude),
            'hourly_rate': float(space.hourly_rate),
            'available_slots': space.available_slots,
            'total_slots': space.total_slots,
            'address': space.address
        })
    
    return Response(map_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    
    # Owner stats
    user_spaces = ParkingSpace.objects.filter(owner=user)
    total_spaces = user_spaces.count()
    total_slots = sum(space.total_slots for space in user_spaces)
    available_slots = sum(space.available_slots for space in user_spaces)
    
    # Booking stats
    user_bookings = Booking.objects.filter(
        parking_slot__parking_space__owner=user
    )
    active_bookings = user_bookings.filter(status__in=['confirmed', 'active']).count()
    
    today = timezone.now().date()
    today_bookings = user_bookings.filter(start_time__date=today).count()
    
    # Revenue stats
    total_revenue = user_bookings.filter(
        status='completed'
    ).aggregate(Sum('paid_amount'))['paid_amount__sum'] or Decimal('0.00')
    
    this_month = timezone.now().replace(day=1)
    monthly_revenue = user_bookings.filter(
        status='completed',
        created_at__gte=this_month
    ).aggregate(Sum('paid_amount'))['paid_amount__sum'] or Decimal('0.00')
    
    stats_data = {
        'total_spaces': total_spaces,
        'total_slots': total_slots,
        'available_slots': available_slots,
        'active_bookings': active_bookings,
        'today_bookings': today_bookings,
        'total_revenue': total_revenue,
        'monthly_revenue': monthly_revenue
    }
    
    serializer = DashboardStatsSerializer(stats_data)
    return Response(serializer.data)
