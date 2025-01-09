from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import DriverProfile
from notifications.services import send_sms, send_email, send_push_notification

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    User yaratilganda avtomatik ravishda tegishli profilni yaratish
    """
    if created:
        # Driver uchun profil yaratish
        if instance.role == 'driver':
            DriverProfile.objects.create(user=instance)

        # Welcome xabarlarini yuborish
        if instance.email and instance.email_notifications:
            send_email(
                to_email=instance.email,
                subject="Xush kelibsiz!",
                template="emails/welcome.html",
                context={"user": instance}
            )

        if instance.phone and instance.sms_notifications:
            send_sms(
                phone=instance.phone,
                message=f"Xush kelibsiz, {instance.get_full_name()}!"
            )

@receiver(pre_save, sender=User)
def user_status_change(sender, instance, **kwargs):
    """
    User statusi o'zgarganda xabarnoma yuborish
    """
    try:
        old_instance = User.objects.get(pk=instance.pk)
        if old_instance.status != instance.status:
            # Status o'zgarishi haqida xabarnoma
            if instance.email and instance.email_notifications:
                send_email(
                    to_email=instance.email,
                    subject="Akkount statusi o'zgarishi",
                    template="emails/status_change.html",
                    context={
                        "user": instance,
                        "old_status": old_instance.status,
                        "new_status": instance.status
                    }
                )

            if instance.phone and instance.sms_notifications:
                send_sms(
                    phone=instance.phone,
                    message=f"Sizning akkountingiz statusi '{instance.status}' ga o'zgartirildi."
                )

    except User.DoesNotExist:
        pass  # Yangi user yaratilayotgan bo'lsa

@receiver(post_save, sender=DriverProfile)
def driver_availability_change(sender, instance, **kwargs):
    """
    Haydovchi holati o'zgarganda xabarnoma yuborish
    """
    if instance.user.push_notifications:
        status = "online" if instance.is_available else "offline"
        send_push_notification(
            user=instance.user,
            title="Status o'zgarishi",
            body=f"Siz hozir {status} holatidasiz",
            data={
                "type": "driver_status",
                "status": status
            }
        )

@receiver(post_save, sender=User)
def user_verification(sender, instance, **kwargs):
    """
    User telefon raqami tasdiqlanganda xabarnoma yuborish
    """
    if instance.is_phone_verified and instance.sms_notifications:
        send_sms(
            phone=instance.phone,
            message="Tabriklaymiz! Sizning telefon raqamingiz tasdiqlandi."
        )

@receiver(pre_save, sender=User)
def track_user_changes(sender, instance, **kwargs):
    """
    User ma'lumotlari o'zgarishini kuzatish
    """
    try:
        old_instance = User.objects.get(pk=instance.pk)
        
        # Email o'zgargan bo'lsa
        if old_instance.email != instance.email:
            instance.email_verified = False
            
        # Telefon o'zgargan bo'lsa    
        if old_instance.phone != instance.phone:
            instance.is_phone_verified = False
            instance.phone_verification_code = None
            instance.phone_verification_code_expires = None
            
    except User.DoesNotExist:
        pass 