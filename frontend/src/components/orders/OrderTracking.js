import React, { useEffect, useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/solid';

const steps = [
  { id: 'pending', title: 'Kutilmoqda', icon: ClockIcon },
  { id: 'confirmed', title: 'Tasdiqlandi', icon: CheckCircleIcon },
  { id: 'preparing', title: 'Tayyorlanmoqda', icon: CheckCircleIcon },
  { id: 'on_way', title: 'Yo\'lda', icon: TruckIcon },
  { id: 'delivered', title: 'Yetkazildi', icon: UserIcon }
];

const OrderTracking = ({ orderId }) => {
  const { trackOrder } = useOrder();
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const data = await trackOrder(orderId);
        setOrderStatus(data);
      } catch (error) {
        console.error('Error fetching order status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
    // Real-time updates uchun WebSocket
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/orders/${orderId}/`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_status') {
        setOrderStatus(prev => ({
          ...prev,
          status: data.status
        }));
      }
    };

    return () => {
      ws.close();
    };
  }, [orderId, trackOrder]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentStepIndex = steps.findIndex(step => step.id === orderStatus?.status);

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200" />

          {/* Steps */}
          <div className="relative space-y-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1 p-4">
                    <div className={`
                      text-sm font-medium
                      ${isCompleted ? 'text-primary-600' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </div>
                    {isCurrent && orderStatus?.estimated_time && (
                      <div className="text-sm text-gray-500 mt-1">
                        Taxminiy vaqt: {orderStatus.estimated_time} daqiqa
                      </div>
                    )}
                  </div>

                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'}
                  `}>
                    <StepIcon className={`
                      w-6 h-6
                      ${isCompleted ? 'text-white' : 'text-gray-400'}
                    `} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 