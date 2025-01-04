from django.urls import path
from .views import NotificationListView, MarkAsReadView
from .consumers import NotificationConsumer

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>/read/', MarkAsReadView.as_view(), name='mark-as-read'),
]
