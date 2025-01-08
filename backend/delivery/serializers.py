from rest_framework import serializers
from .models import DeliveryPerson, Delivery
from orders.serializers import OrderSerializer
from users.serializers import UserSerializer

class DeliveryPersonSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    total_deliveries = serializers.SerializerMethodField()
    success_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = DeliveryPerson
        fields = [
            'id', 'user', 'full_name', 'vehicle_type', 'vehicle_number',
            'is_available', 'current_latitude', 'current_longitude',
            'last_location_update', 'total_deliveries', 'success_rate'
        ]
        read_only_fields = ['user', 'last_location_update']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_total_deliveries(self, obj):
        return obj.delivery_set.count()

    def get_success_rate(self, obj):
        total = obj.delivery_set.count()
        if total > 0:
            successful = obj.delivery_set.filter(status='delivered').count()
            return round((successful / total) * 100, 2)
        return 0

class DeliverySerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    delivery_person = DeliveryPersonSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = Delivery
        fields = [
            'id', 'order', 'delivery_person', 'status', 'status_display',
            'pickup_time', 'delivery_time', 'current_latitude',
            'current_longitude', 'created_at', 'updated_at', 'duration'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_duration(self, obj):
        if obj.pickup_time and obj.delivery_time:
            duration = obj.delivery_time - obj.pickup_time
            return duration.total_seconds() // 60  # Minutes
        return None

class DeliveryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['order', 'delivery_person', 'status']