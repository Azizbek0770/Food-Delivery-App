from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AddressViewSet, DriverProfileViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'drivers', DriverProfileViewSet, basename='driver')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),

    # Authentication URLs
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Custom authentication endpoints
    path('auth/register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path(
        'auth/verify-phone/',
        UserViewSet.as_view({'post': 'verify_phone'}),
        name='verify-phone'
    ),
    path(
        'auth/verify-code/',
        UserViewSet.as_view({'post': 'verify_code'}),
        name='verify-code'
    ),
    path(
        'auth/change-password/',
        UserViewSet.as_view({'post': 'change_password'}),
        name='change-password'
    ),

    # Driver specific endpoints
    path(
        'drivers/toggle-availability/',
        DriverProfileViewSet.as_view({'post': 'toggle_availability'}),
        name='driver-toggle-availability'
    ),
    path(
        'drivers/update-location/',
        DriverProfileViewSet.as_view({'post': 'update_location'}),
        name='driver-update-location'
    ),
]

# Add to backend/config/urls.py
# path('api/v1/', include('users.urls')), 