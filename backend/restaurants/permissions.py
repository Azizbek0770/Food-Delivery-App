from rest_framework import permissions

class IsRestaurantOwner(permissions.BasePermission):
    """
    Restaurant egasi uchun ruxsat
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.owner == request.user

class IsRestaurantStaff(permissions.BasePermission):
    """
    Restaurant xodimlari uchun ruxsat
    """
    def has_permission(self, request, view):
        restaurant_id = view.kwargs.get('restaurant_pk')
        if not restaurant_id:
            return False
            
        return request.user.restaurants.filter(id=restaurant_id).exists() or \
               request.user.restaurant_staff.filter(id=restaurant_id).exists()

    def has_object_permission(self, request, view, obj):
        # Restaurant ga tegishli bo'lgan obyektlar uchun
        restaurant = getattr(obj, 'restaurant', None)
        if not restaurant:
            restaurant = getattr(obj, 'category', None).restaurant if \
                        hasattr(obj, 'category') else None
        
        if not restaurant:
            return False

        return request.user == restaurant.owner or \
               restaurant.staff.filter(id=request.user.id).exists()