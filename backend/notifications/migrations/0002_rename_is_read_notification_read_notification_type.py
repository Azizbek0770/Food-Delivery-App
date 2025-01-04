# Generated by Django 5.1.4 on 2025-01-04 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='is_read',
            new_name='read',
        ),
        migrations.AddField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('order_status', 'Order Status'), ('promotion', 'Promotion'), ('general', 'General')], default='general', max_length=20),
        ),
    ]
