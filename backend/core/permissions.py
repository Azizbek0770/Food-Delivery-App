from rest_framework import permissions

class IsRestaurantOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsDeliveryPerson(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'delivery'

class IsOrderOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsRestaurantStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'restaurant'