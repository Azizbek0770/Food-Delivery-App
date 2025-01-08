from rest_framework import permissions

class IsDeliveryPerson(permissions.BasePermission):
    """
    Faqat yetkazib beruvchilar uchun ruxsat
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'delivery')

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'delivery_person'):
            return obj.delivery_person.user == request.user
        return obj.user == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Admin foydalanuvchilar uchun to'liq ruxsat,
    boshqalar uchun faqat ko'rish
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)