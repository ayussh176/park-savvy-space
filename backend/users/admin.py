from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile


class UserProfileInline(admin.StackedInline):
    """Inline admin descriptor for UserProfile model."""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'
    fields = (
        'avatar', 'bio', 'date_of_birth', 'address', 'city', 'state', 'zip_code', 'country',
        'notifications_enabled', 'email_notifications', 'sms_notifications'
    )


class CustomUserAdmin(UserAdmin):
    """Admin configuration for CustomUser model."""
    inlines = (UserProfileInline,)
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_active', 'date_joined')
    list_filter = ('user_type', 'is_verified', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone_number', 'user_type', 'is_verified')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'phone_number', 'user_type', 'is_verified')
        }),
    )


class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile model."""
    list_display = ('user', 'city', 'country', 'notifications_enabled', 'created_at')
    list_filter = ('country', 'notifications_enabled', 'email_notifications', 'sms_notifications', 'created_at')
    search_fields = ('user__email', 'user__username', 'city', 'state', 'country')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Profile Details', {
            'fields': ('avatar', 'bio', 'date_of_birth')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'zip_code', 'country')
        }),
        ('Notification Preferences', {
            'fields': ('notifications_enabled', 'email_notifications', 'sms_notifications')
        }),
    )


# Register the models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)

# Update admin site header and title
admin.site.site_header = "Park Savvy Administration"
admin.site.site_title = "Park Savvy Admin Portal"
admin.site.index_title = "Welcome to Park Savvy Administration"
