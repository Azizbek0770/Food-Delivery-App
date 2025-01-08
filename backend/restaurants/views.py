from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from .models import Restaurant, Category, Product, WorkingHours, RestaurantReview
from .serializers import (
    RestaurantSerializer, RestaurantListSerializer, RestaurantDashboardSerializer,
    CategorySerializer, ProductSerializer, WorkingHoursSerializer,
    RestaurantReviewSerializer
)
from .permissions import IsRestaurantOwner, IsRestaurantStaff

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'address']

    def get_serializer_class(self):
        if self.action == 'list':
            return RestaurantListSerializer
        if self.action == 'dashboard':
            return RestaurantDashboardSerializer
        return RestaurantSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'dashboard']:
            self.permission_classes = [IsAuthenticated, IsRestaurantOwner]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        restaurant = self.get_object()
        today = timezone.now().date()
        
        # Bugungi buyurtmalar va daromad
        today_orders = restaurant.orders.filter(
            created_at__date=today
        ).aggregate(
            count=Count('id'),
            revenue=Sum('total_amount')
        )

        # Umumiy buyurtmalar va daromad
        total_stats = restaurant.orders.aggregate(
            count=Count('id'),
            revenue=Sum('total_amount')
        )

        # Mashhur mahsulotlar
        popular_products = Product.objects.filter(
            category__restaurant=restaurant
        ).annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:5]

        # Oxirgi sharhlar
        recent_reviews = restaurant.reviews.all()[:5]

        data = {
            'today_orders': today_orders['count'] or 0,
            'today_revenue': today_orders['revenue'] or 0,
            'total_orders': total_stats['count'] or 0,
            'total_revenue': total_stats['revenue'] or 0,
            'popular_products': ProductSerializer(popular_products, many=True).data,
            'recent_reviews': RestaurantReviewSerializer(recent_reviews, many=True).data
        }

        serializer = self.get_serializer(restaurant, data=data)
        serializer.is_valid()
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        restaurant = self.get_object()
        restaurant.is_active = not restaurant.is_active
        restaurant.save()
        return Response({'status': 'success'})

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsRestaurantStaff]

    def get_queryset(self):
        return Category.objects.filter(
            restaurant_id=self.kwargs['restaurant_pk']
        ).annotate(
            products_count=Count('products')
        )

    def perform_create(self, serializer):
        serializer.save(restaurant_id=self.kwargs['restaurant_pk'])

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsRestaurantStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        return Product.objects.filter(
            category__restaurant_id=self.kwargs['restaurant_pk']
        )

    def perform_create(self, serializer):
        category = Category.objects.get(
            id=self.request.data['category'],
            restaurant_id=self.kwargs['restaurant_pk']
        )
        serializer.save(category=category)

class WorkingHoursViewSet(viewsets.ModelViewSet):
    serializer_class = WorkingHoursSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get_queryset(self):
        return WorkingHours.objects.filter(
            restaurant_id=self.kwargs['restaurant_pk']
        )

    def perform_create(self, serializer):
        serializer.save(restaurant_id=self.kwargs['restaurant_pk'])

class RestaurantReviewViewSet(viewsets.ModelViewSet):
    serializer_class = RestaurantReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return RestaurantReview.objects.filter(
            restaurant_id=self.kwargs['restaurant_pk']
        )

    def perform_create(self, serializer):
        serializer.save(
            restaurant_id=self.kwargs['restaurant_pk'],
            user=self.request.user
        )