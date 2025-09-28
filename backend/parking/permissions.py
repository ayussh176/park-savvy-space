from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit it."""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object
        return obj.owner == request.user

class IsBookingOwnerOrParkingOwner(permissions.BasePermission):
    """Custom permission for bookings - allows booking owner or parking space owner."""
    
    def has_object_permission(self, request, view, obj):
        # Allow the booking owner to access
        if obj.user == request.user:
            return True
        
        # Allow the parking space owner to access
        if obj.parking_slot.parking_space.owner == request.user:
            return True
        
        return False

class IsParkingSlotOwner(permissions.BasePermission):
    """Custom permission for parking slots - only parking space owner can modify."""
    
    def has_object_permission(self, request, view, obj):
        return obj.parking_space.owner == request.user
