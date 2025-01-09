from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin permissions
        if request.user.is_staff:
            return True

        # Check if obj has user attribute directly
        if hasattr(obj, 'user'):
            return obj.user == request.user
            
        # Check if obj is the user
        return obj == request.user

class IsDriver(permissions.BasePermission):
    """
    Custom permission to only allow drivers to access driver-specific views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'driver'

    def has_object_permission(self, request, view, obj):
        # Admin permissions
        if request.user.is_staff:
            return True
            
        # Allow drivers to see only their own profile
        return obj.user == request.user

class IsRestaurantOwner(permissions.BasePermission):
    """
    Custom permission to only allow restaurant owners to access restaurant-specific views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'restaurant'

    def has_object_permission(self, request, view, obj):
        # Admin permissions
        if request.user.is_staff:
            return True
            
        # Allow restaurant owners to manage only their own restaurant
        return obj.restaurant == request.user.restaurant

class IsCustomer(permissions.BasePermission):
    """
    Custom permission to only allow customers to access customer-specific views.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'customer'

class IsVerifiedUser(permissions.BasePermission):
    """
    Custom permission to only allow verified users to access certain views.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.is_phone_verified
        )

class IsActiveUser(permissions.BasePermission):
    """
    Custom permission to only allow active users to access views.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.status == 'active'
        )

class ReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow read-only access.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS 