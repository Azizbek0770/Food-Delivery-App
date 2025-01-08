from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet, DeliveryPersonViewSet

router = DefaultRouter()
router.register(r'deliveries', DeliveryViewSet, basename='delivery')
router.register(r'delivery-persons', DeliveryPersonViewSet, basename='delivery-person')

urlpatterns = [
    path('', include(router.urls)),
    path('active-deliveries/', DeliveryViewSet.as_view({'get': 'active_deliveries'})),
    path('update-location/', DeliveryViewSet.as_view({'post': 'update_location'})),
    path('toggle-availability/', DeliveryViewSet.as_view({'post': 'toggle_availability'})),
    path('statistics/', DeliveryViewSet.as_view({'get': 'statistics'})),
    path('deliveries/<int:pk>/status/', DeliveryViewSet.as_view({'post': 'update_status'})),
]