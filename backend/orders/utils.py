from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_order_update(order_id, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'order_{order_id}',
        {'type': 'order_update', 'message': message}
    )
