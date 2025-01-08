from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Delivery
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=Delivery)
def delivery_status_changed(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    
    # Yetkazib beruvchi uchun xabar
    if instance.delivery_person:
        async_to_sync(channel_layer.group_send)(
            f"delivery_{instance.delivery_person.id}",
            {
                "type": "delivery_update",
                "delivery_id": instance.id,
                "status": instance.status
            }
        )
    
    # Mijoz uchun xabar
    if instance.order.user:
        async_to_sync(channel_layer.group_send)(
            f"user_{instance.order.user.id}",
            {
                "type": "delivery_update",
                "delivery_id": instance.id,
                "status": instance.status
            }
        )