"""Django URL configuration for park_savvy project."""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

def api_root(request):
    """Root API endpoint"""
    return JsonResponse({
        'message': 'Welcome to Park Savvy Space API',
        'version': '1.0.0',
        'project': 'park_savvy',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/v1/',
            'auth': {
                'token': '/api/v1/auth/token/',
                'token_refresh': '/api/v1/auth/token/refresh/',
                'token_verify': '/api/v1/auth/token/verify/',
            },
            'users': '/api/v1/users/',
            'parking': '/api/v1/parking/',
            'docs': '/api/docs/',  # For future API documentation
        }
    })

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API root
    path('', api_root, name='api-root'),
    
    # JWT Authentication endpoints
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API versioning
    path('api/v1/', api_root, name='api-v1-root'),
    
    # App URLs
    path('api/v1/users/', include('users.urls')),
    path('api/v1/parking/', include('parking.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
