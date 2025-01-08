from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Restaurant, Product, RestaurantReview

@receiver(post_save, sender=Restaurant)
def restaurant_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    
    if created:
        # Yangi restaurant qo'shilganda
        async_to_sync(channel_layer.group_send)(
            "restaurants",
            {
                "type": "restaurant.added",
                "restaurant": {
                    "id": instance.id,
                    "name": instance.name,
                    "image": instance.image.url if instance.image else None,
                }
            }
        )
    else:
        # Restaurant yangilanganda
        async_to_sync(channel_layer.group_send)(
            f"restaurant_{instance.id}",
            {
                "type": "restaurant.updated",
                "restaurant": {
                    "id": instance.id,
                    "is_active": instance.is_active,
                }
            }
        )

@receiver([post_save, post_delete], sender=Product)
def product_changed(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"restaurant_{instance.category.restaurant_id}",
        {
            "type": "product.changed",
            "category_id": instance.category_id
        }
    )

@receiver(post_save, sender=RestaurantReview)
def review_added(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(
            f"restaurant_{instance.restaurant_id}",
            {
                "type": "review.added",
                "review": {
                    "id": instance.id,
                    "rating": instance.rating,
                    "user": instance.user.get_full_name(),
                }
            }
        ) 