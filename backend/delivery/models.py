from django.db import models
from users.models import User
from orders.models import Order

class DeliveryPerson(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    vehicle_type = models.CharField(max_length=50)
    vehicle_number = models.CharField(max_length=20)
    is_available = models.BooleanField(default=True)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    last_location_update = models.DateTimeField(auto_now=True)

class Delivery(models.Model):
    STATUS_CHOICES = (
        ('assigned', 'Assigned'),
        ('picked_up', 'Picked Up'),
        ('on_way', 'On the Way'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery')
    delivery_person = models.ForeignKey(DeliveryPerson, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    pickup_time = models.DateTimeField(null=True)
    delivery_time = models.DateTimeField(null=True)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at'] 