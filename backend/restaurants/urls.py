from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    RestaurantViewSet,
    CategoryViewSet,
    ProductViewSet,
    WorkingHoursViewSet,
    RestaurantReviewViewSet
)

router = routers.DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)

# Restaurant ichidagi resurslar uchun nested router
restaurant_router = routers.NestedDefaultRouter(router, r'restaurants', lookup='restaurant')
restaurant_router.register(r'categories', CategoryViewSet, basename='restaurant-categories')
restaurant_router.register(r'products', ProductViewSet, basename='restaurant-products')
restaurant_router.register(r'working-hours', WorkingHoursViewSet, basename='restaurant-working-hours')
restaurant_router.register(r'reviews', RestaurantReviewViewSet, basename='restaurant-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(restaurant_router.urls)),
]

# API endpoints:
# /api/restaurants/
# /api/restaurants/{id}/
# /api/restaurants/{id}/dashboard/
# /api/restaurants/{id}/toggle-status/
# /api/restaurants/{id}/categories/
# /api/restaurants/{id}/products/
# /api/restaurants/{id}/working-hours/
# /api/restaurants/{id}/reviews/