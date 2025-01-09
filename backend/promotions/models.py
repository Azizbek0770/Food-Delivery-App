from django.db import models
from restaurants.models import Restaurant, Product
from users.models import User

class Promotion(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    usage_limit = models.IntegerField(null=True)
    used_count = models.IntegerField(default=0)
    restaurants = models.ManyToManyField(Restaurant, blank=True)
    items = models.ManyToManyField(
        Product,
        related_name='promotions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class UserPromotion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'promotion'] 