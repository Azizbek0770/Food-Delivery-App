from django.contrib import admin
from .models import DeliveryPerson, Delivery

@admin.register(DeliveryPerson)
class DeliveryPersonAdmin(admin.ModelAdmin):
    list_display = ['user', 'vehicle_type', 'vehicle_number', 'is_available', 'last_location_update']
    list_filter = ['is_available', 'vehicle_type']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'vehicle_number']
    raw_id_fields = ['user']

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'delivery_person', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = ['order__id', 'delivery_person__user__username']
    raw_id_fields = ['order', 'delivery_person']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'order', 'delivery_person', 'delivery_person__user'
        )
