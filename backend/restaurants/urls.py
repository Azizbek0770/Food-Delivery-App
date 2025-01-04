from django.urls import path
from .views import RestaurantListCreateView, MenuItemListCreateView, MenuItemDetailView

urlpatterns = [
    path('restaurants/', RestaurantListCreateView.as_view(), name='restaurant-list'),
    path('menu-items/', MenuItemListCreateView.as_view(), name='menu-item-list'),
    path('menu-items/<int:pk>/', MenuItemDetailView.as_view(), name='menu-item-detail'),
]
