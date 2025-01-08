from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from .models import DeliveryPerson, Delivery
from .serializers import DeliveryPersonSerializer, DeliverySerializer
from orders.models import Order
from .permissions import IsDeliveryPerson

class DeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated, IsDeliveryPerson]

    def get_queryset(self):
        return Delivery.objects.filter(delivery_person__user=self.request.user)

    @action(detail=False, methods=['get'])
    def active_deliveries(self, request):
        """Faol yetkazib berishlarni olish"""
        active_statuses = ['assigned', 'picked_up', 'on_way']
        deliveries = self.get_queryset().filter(status__in=active_statuses)
        serializer = self.get_serializer(deliveries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Yetkazib berish statusini yangilash"""
        delivery = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Delivery.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Status o'zgarishiga qarab vaqtlarni yangilash
        if new_status == 'picked_up':
            delivery.pickup_time = timezone.now()
            # Buyurtma statusini ham yangilash
            delivery.order.status = 'on_delivery'
            delivery.order.save()
        elif new_status == 'on_way':
            if not delivery.pickup_time:
                delivery.pickup_time = timezone.now()
        elif new_status == 'delivered':
            delivery.delivery_time = timezone.now()
            # Buyurtma statusini ham yangilash
            delivery.order.status = 'delivered'
            delivery.order.save()
            # Yetkazib beruvchini qayta band qilish
            delivery.delivery_person.is_available = True
            delivery.delivery_person.save()
        elif new_status == 'failed':
            # Buyurtma statusini yangilash
            delivery.order.status = 'cancelled'
            delivery.order.save()
            # Yetkazib beruvchini qayta band qilish
            delivery.delivery_person.is_available = True
            delivery.delivery_person.save()

        delivery.status = new_status
        delivery.save()
        
        serializer = self.get_serializer(delivery)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_location(self, request):
        """Yetkazib beruvchi lokatsiyasini yangilash"""
        try:
            delivery_person = request.user.deliveryperson
            delivery_person.current_latitude = request.data.get('latitude')
            delivery_person.current_longitude = request.data.get('longitude')
            delivery_person.save()

            # Agar faol yetkazib berish bo'lsa, uning lokatsiyasini ham yangilash
            active_delivery = Delivery.objects.filter(
                delivery_person=delivery_person,
                status__in=['picked_up', 'on_way']
            ).first()
            
            if active_delivery:
                active_delivery.current_latitude = request.data.get('latitude')
                active_delivery.current_longitude = request.data.get('longitude')
                active_delivery.save()

            return Response({'status': 'Location updated successfully'})
        except DeliveryPerson.DoesNotExist:
            return Response(
                {'error': 'Delivery person profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def toggle_availability(self, request):
        """Yetkazib beruvchi bandligini almashtirish"""
        try:
            delivery_person = request.user.deliveryperson
            
            # Agar faol yetkazib berish bo'lsa, bandlikni o'zgartirish mumkin emas
            active_delivery = Delivery.objects.filter(
                delivery_person=delivery_person,
                status__in=['assigned', 'picked_up', 'on_way']
            ).exists()
            
            if active_delivery and delivery_person.is_available:
                return Response(
                    {'error': 'Cannot change availability while having active deliveries'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            delivery_person.is_available = not delivery_person.is_available
            delivery_person.save()
            
            serializer = DeliveryPersonSerializer(delivery_person)
            return Response(serializer.data)
        except DeliveryPerson.DoesNotExist:
            return Response(
                {'error': 'Delivery person profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Yetkazib beruvchi statistikasini olish"""
        try:
            delivery_person = request.user.deliveryperson
            today = timezone.now().date()
            
            # Bugungi statistika
            today_deliveries = Delivery.objects.filter(
                delivery_person=delivery_person,
                created_at__date=today
            )
            
            today_stats = {
                'total': today_deliveries.count(),
                'delivered': today_deliveries.filter(status='delivered').count(),
                'failed': today_deliveries.filter(status='failed').count(),
                'active': today_deliveries.filter(
                    status__in=['assigned', 'picked_up', 'on_way']
                ).count()
            }
            
            # Umumiy statistika
            all_deliveries = Delivery.objects.filter(delivery_person=delivery_person)
            total_stats = {
                'total': all_deliveries.count(),
                'delivered': all_deliveries.filter(status='delivered').count(),
                'failed': all_deliveries.filter(status='failed').count(),
                'success_rate': 0
            }
            
            if total_stats['total'] > 0:
                total_stats['success_rate'] = (
                    total_stats['delivered'] / total_stats['total']
                ) * 100
            
            return Response({
                'today': today_stats,
                'total': total_stats
            })
            
        except DeliveryPerson.DoesNotExist:
            return Response(
                {'error': 'Delivery person profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
