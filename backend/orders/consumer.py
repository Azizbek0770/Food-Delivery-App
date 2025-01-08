from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Order

class OrderTrackingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.room_group_name = f'order_{self.order_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive_json(self, content):
        message_type = content.get('type')
        if message_type == 'status_update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'order_status',
                    'status': content['status']
                }
            )
        elif message_type == 'location_update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'delivery_location',
                    'latitude': content['latitude'],
                    'longitude': content['longitude']
                }
            )

    async def order_status(self, event):
        await self.send_json({
            'type': 'order_status',
            'status': event['status']
        })

    async def delivery_location(self, event):
        await self.send_json({
            'type': 'delivery_location',
            'latitude': event['latitude'],
            'longitude': event['longitude']
        })