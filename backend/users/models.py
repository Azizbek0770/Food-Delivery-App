from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from django.contrib.gis.db import models as gis_models
from restaurants.models import Restaurant
from django.contrib.auth.models import User

class User(AbstractUser):
    class Roles(models.TextChoices):
        CUSTOMER = 'customer', _('Customer')
        RESTAURANT = 'restaurant', _('Restaurant Owner')
        DRIVER = 'driver', _('Delivery Driver')
        ADMIN = 'admin', _('Administrator')

    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        BLOCKED = 'blocked', _('Blocked')

    # Asosiy maydonlar
    phone_regex = RegexValidator(
        regex=r'^\+998\d{9}$',
        message=_("Phone number must be in format: '+998901234567'")
    )
    phone = models.CharField(
        _('phone number'),
        max_length=13,
        validators=[phone_regex],
        unique=True
    )
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.CUSTOMER
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True
    )

    # Tasdiqlash maydonlari
    is_phone_verified = models.BooleanField(default=False)
    phone_verification_code = models.CharField(max_length=6, null=True, blank=True)
    phone_verification_code_expires = models.DateTimeField(null=True, blank=True)

    # Manzil
    default_address = models.ForeignKey(
        'users.Address',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users_default'
    )

    # Restaurant aloqasi
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff'
    )

    # Sozlamalar
    language = models.CharField(
        max_length=2,
        choices=[('uz', 'Uzbek'), ('ru', 'Russian'), ('en', 'English')],
        default='uz'
    )
    push_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)

    # Meta ma'lumotlar
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f"{self.get_full_name()} ({self.phone})"

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(max_length=255)
    location = gis_models.PointField()
    address = models.CharField(max_length=255)
    apartment = models.CharField(max_length=50, blank=True)
    floor = models.CharField(max_length=10, blank=True)
    comment = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('address')
        verbose_name_plural = _('addresses')
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title}"

    def save(self, *args, **kwargs):
        if self.is_default:
            # Boshqa manzillarni default emas qilish
            Address.objects.filter(user=self.user).update(is_default=False)
            # User default manzilini yangilash
            self.user.default_address = self
            self.user.save()
        super().save(*args, **kwargs)

class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    vehicle_type = models.CharField(max_length=50)
    vehicle_number = models.CharField(max_length=20)
    license_number = models.CharField(max_length=50)
    is_available = models.BooleanField(default=False)
    current_location = gis_models.PointField(null=True)
    rating = models.FloatField(default=0)
    total_orders = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Driver: {self.user.get_full_name()}" 