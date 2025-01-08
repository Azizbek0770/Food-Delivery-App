from django.apps import AppConfig


class RestaurantsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'restaurants'
    verbose_name = 'Restaurants'

    def ready(self):
        import restaurants.signals
