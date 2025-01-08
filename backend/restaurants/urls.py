from django.urls import path
from . import views

urlpatterns = [
    path('', views.RestaurantViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('<int:pk>/', views.RestaurantViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    path('<int:pk>/menu/', views.RestaurantViewSet.as_view({
        'get': 'menu'
    })),
    path('<int:pk>/reviews/', views.RestaurantViewSet.as_view({
        'get': 'reviews',
        'post': 'add_review'
    })),
]