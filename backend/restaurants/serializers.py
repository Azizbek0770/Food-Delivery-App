from rest_framework import serializers
from .models import Restaurant, Category, Product, WorkingHours, RestaurantReview
from users.serializers import UserSerializer

class WorkingHoursSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_display', read_only=True)
    
    class Meta:
        model = WorkingHours
        fields = ['id', 'day', 'day_name', 'opening_time', 'closing_time', 'is_closed']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'description',
            'price', 'image', 'is_available', 'preparation_time',
            'calories', 'is_vegetarian', 'is_spicy', 'created_at'
        ]

class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    products_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'image', 'is_active',
            'order', 'products', 'products_count', 'created_at'
        ]

class RestaurantReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = RestaurantReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class RestaurantSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    working_hours = WorkingHoursSerializer(many=True, read_only=True)
    reviews = RestaurantReviewSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    is_open = serializers.SerializerMethodField()
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner', 'name', 'description', 'address', 'phone',
            'image', 'latitude', 'longitude', 'is_active', 'delivery_radius',
            'minimum_order', 'average_delivery_time', 'rating',
            'total_ratings', 'categories', 'working_hours', 'reviews',
            'is_open', 'created_at'
        ]
        read_only_fields = ['owner', 'rating', 'total_ratings']

    def get_is_open(self, obj):
        from django.utils import timezone
        import datetime
        
        now = timezone.localtime()
        current_time = now.time()
        current_day = now.weekday()
        
        try:
            working_hours = obj.working_hours.get(day=current_day)
            if working_hours.is_closed:
                return False
            return (
                working_hours.opening_time <= current_time <= working_hours.closing_time
            )
        except WorkingHours.DoesNotExist:
            return False

class RestaurantListSerializer(serializers.ModelSerializer):
    """Ro'yxat uchun soddalashtirilgan serializer"""
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'image', 'address', 'rating',
            'total_ratings', 'is_active', 'minimum_order'
        ]

class RestaurantDashboardSerializer(serializers.ModelSerializer):
    """Restaurant egasi uchun dashboard ma'lumotlari"""
    today_orders = serializers.IntegerField()
    today_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    popular_products = ProductSerializer(many=True)
    recent_reviews = RestaurantReviewSerializer(many=True)
    
    class Meta:
        model = Restaurant
        fields = [
            'id', 'name', 'rating', 'total_ratings', 'today_orders',
            'today_revenue', 'total_orders', 'total_revenue',
            'popular_products', 'recent_reviews'
        ]