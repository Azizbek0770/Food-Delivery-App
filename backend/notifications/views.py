from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class MarkAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.mark_as_read()
            return Response({'success': True, 'message': 'Notification marked as read.'})
        except Notification.DoesNotExist:
            return Response({'success': False, 'message': 'Notification not found.'}, status=404)


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notif_type = request.query_params.get('type')
        notifications = Notification.objects.filter(user=request.user)
        if notif_type:
            notifications = notifications.filter(type=notif_type)
        notifications = notifications.order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
