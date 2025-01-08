from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/orders/(?P<order_id>\w+)/$', consumers.OrderTrackingConsumer.as_asgi()),
]