from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from notifications.models import Notification
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class Command(BaseCommand):
    help = 'Send promotional notifications'

    def handle(self, *args, **kwargs):
        try:
            users = User.objects.all()
            for user in users:
                Notification.objects.create(
                    user=user,
                    message="Check out our latest promotions!",
                    type="promotion"
                )
            self.stdout.write(self.style.SUCCESS('Promotional notifications sent!'))
        except Exception as e:
            logger.error(f"Error sending promotions: {e}")
            self.stderr.write(f"Error: {e}")
