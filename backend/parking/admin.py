from django.contrib import admin
from .models import ParkingSpace, ParkingSlot, Booking

@admin.register(ParkingSpace)
class ParkingSpaceAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'address', 'hourly_rate', 'is_active', 'created_at']
    list_filter = ['is_active', 'has_security', 'has_covered_parking', 'has_ev_charging', 'created_at']
    search_fields = ['name', 'address', 'owner__username']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'address', 'owner')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Pricing', {
            'fields': ('hourly_rate', 'daily_rate')
        }),
        ('Amenities', {
            'fields': ('has_security', 'has_covered_parking', 'has_ev_charging', 'has_disability_access')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ParkingSlot)
class ParkingSlotAdmin(admin.ModelAdmin):
    list_display = ['parking_space', 'slot_number', 'slot_type', 'is_available', 'is_reserved', 'created_at']
    list_filter = ['slot_type', 'is_available', 'is_reserved', 'created_at']
    search_fields = ['slot_number', 'parking_space__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('parking_space', 'slot_number', 'slot_type', 'notes')
        }),
        ('Status', {
            'fields': ('is_available', 'is_reserved')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_reference', 'user', 'parking_space_name', 'slot_number', 'status', 'start_time', 'end_time', 'total_amount']
    list_filter = ['status', 'start_time', 'created_at']
    search_fields = ['booking_reference', 'user__username', 'vehicle_number']
    readonly_fields = ['booking_reference', 'created_at', 'updated_at']
    date_hierarchy = 'start_time'
    
    def parking_space_name(self, obj):
        return obj.parking_slot.parking_space.name
    parking_space_name.short_description = 'Parking Space'
    
    def slot_number(self, obj):
        return obj.parking_slot.slot_number
    slot_number.short_description = 'Slot'
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_reference', 'user', 'parking_slot', 'status')
        }),
        ('Vehicle Information', {
            'fields': ('vehicle_number', 'vehicle_type')
        }),
        ('Timing', {
            'fields': ('start_time', 'end_time', 'actual_start_time', 'actual_end_time')
        }),
        ('Pricing', {
            'fields': ('hourly_rate', 'total_amount', 'paid_amount')
        }),
        ('Additional Information', {
            'fields': ('special_instructions',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
