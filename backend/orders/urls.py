from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('<int:pk>/', views.OrderViewSet.as_view({
        'get': 'retrieve'
    })),
    path('<int:pk>/status/', views.OrderViewSet.as_view({
        'post': 'update_status'
    })),
    path('track/<int:pk>/', views.OrderViewSet.as_view({
        'get': 'track'
    })),
]
