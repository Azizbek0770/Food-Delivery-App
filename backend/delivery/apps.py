from django.apps import AppConfig

class DeliveryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'delivery'
    verbose_name = 'Yetkazib berish'

    def ready(self):
        import delivery.signals