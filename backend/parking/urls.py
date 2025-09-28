"""Parking app URL configuration."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for viewsets
router = DefaultRouter()
router.register(r'spaces', views.ParkingSpaceViewSet, basename='parkingspace')
router.register(r'slots', views.ParkingSlotViewSet, basename='parkingslot')
router.register(r'bookings', views.BookingViewSet, basename='booking')

app_name = 'parking'

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Search and filter endpoints
    path('spaces/search/', views.ParkingSpaceSearchView.as_view(), name='space-search'),
    path('spaces/nearby/', views.NearbyParkingSpacesView.as_view(), name='spaces-nearby'),
    
    # Booking management
    path('bookings/my/', views.MyBookingsView.as_view(), name='my-bookings'),
    path('bookings/active/', views.ActiveBookingsView.as_view(), name='active-bookings'),
    
    # Analytics and management (for owners)
    path('my-spaces/', views.MyParkingSpacesView.as_view(), name='my-spaces'),
]
