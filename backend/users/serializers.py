from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from .models import Address, DriverProfile
from restaurants.serializers import RestaurantSerializer
from orders.serializers import OrderSerializer

User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(write_only=True)
    longitude = serializers.FloatField(write_only=True)

    class Meta:
        model = Address
        fields = [
            'id', 'title', 'address', 'apartment', 'floor',
            'comment', 'is_default', 'latitude', 'longitude'
        ]

    def create(self, validated_data):
        lat = validated_data.pop('latitude')
        lng = validated_data.pop('longitude')
        validated_data['location'] = Point(lng, lat)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'latitude' in validated_data and 'longitude' in validated_data:
            lat = validated_data.pop('latitude')
            lng = validated_data.pop('longitude')
            validated_data['location'] = Point(lng, lat)
        return super().update(instance, validated_data)

class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    default_address = AddressSerializer(read_only=True)
    restaurant = RestaurantSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'role', 'status', 'avatar', 'language',
            'push_notifications', 'email_notifications', 'sms_notifications',
            'addresses', 'default_address', 'restaurant',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['role', 'status', 'created_at', 'updated_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'password', 'role'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    current_orders = OrderSerializer(many=True, read_only=True)
    
    class Meta:
        model = DriverProfile
        fields = [
            'id', 'user', 'vehicle_type', 'vehicle_number',
            'license_number', 'is_available', 'current_location',
            'rating', 'total_orders', 'current_orders',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['rating', 'total_orders']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email',
            'avatar', 'language',
            'push_notifications', 'email_notifications', 'sms_notifications'
        ]

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )
        return value

class PhoneVerificationSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, min_length=6) 