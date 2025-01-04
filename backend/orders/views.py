from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from .models import Order, OrderItem
from restaurants.models import Restaurant, MenuItem
from .serializers import OrderSerializer, OrderItemSerializer

class OrderListCreateView(ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'customer':
            return Order.objects.filter(customer=self.request.user)
        elif self.request.user.role == 'restaurant':
            return Order.objects.filter(restaurant__owner=self.request.user)
        else:
            return Order.objects.none()

    def perform_create(self, serializer):
        restaurant_id = self.request.data.get('restaurant')  # This line is now properly indented
        restaurant = Restaurant.objects.get(id=restaurant_id)
        serializer.save(customer=self.request.user, restaurant=restaurant)

class OrderDetailView(RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'customer':
            return Order.objects.filter(customer=self.request.user)
        elif self.request.user.role == 'restaurant':
            return Order.objects.filter(restaurant__owner=self.request.user)
        else:
            return Order.objects.none()
    
    def perform_update(self, serializer):
        order = serializer.save()

        Notification.objects.create(
            user=order.customer,
            message=f"Your order status has been updated to {order.status}."
        )
        send_notification_to_user(order.customer.id, f"Order {order.id} status: {order.status}")
    
    def perform_destroy(self, instance):
        instance.delete()
        Notification.objects.create(
            user=instance.customer,
            message=f"Your order {instance.id} has been deleted."
        )
        send_notification_to_user(instance.customer.id, f"Order {instance.id} has been deleted.")
