from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.permissions import IsRestaurantOwner, IsRestaurantStaff
from .models import Restaurant, MenuItem, Review
from .serializers import RestaurantSerializer, MenuItemSerializer, ReviewSerializer

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'])
    def menu(self, request, pk=None):
        restaurant = self.get_object()
        menu_items = MenuItem.objects.filter(
            restaurant=restaurant,
            is_available=True
        )
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        restaurant = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user=request.user,
                restaurant=restaurant
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            permission_classes = [IsRestaurantOwner]
        elif self.action in ['menu']:
            permission_classes = [IsRestaurantStaff]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]