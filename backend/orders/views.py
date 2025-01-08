from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from core.permissions import IsOrderOwner
from .models import Order
from .serializers import OrderSerializer
from notifications.models import Notification

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsOrderOwner]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'customer':
            return Order.objects.filter(user=user)
        elif user.role == 'restaurant':
            return Order.objects.filter(restaurant__owner=user)
        elif user.role == 'delivery':
            return Order.objects.filter(delivery__delivery_person__user=user)
        return Order.objects.none()

    def perform_create(self, serializer):
        order = serializer.save(
            user=self.request.user,
            status='pending'
        )
        
        # Create notification for restaurant
        Notification.objects.create(
            user=order.restaurant.owner,
            title='New Order',
            message=f'New order #{order.id} received',
            notification_type='order_status',
            order=order
        )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        # Create notification for customer
        Notification.objects.create(
            user=order.user,
            title='Order Status Updated',
            message=f'Your order #{order.id} is now {new_status}',
            notification_type='order_status',
            order=order
        )

        return Response({'status': 'updated'})