import React from 'react';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';

const OrderDetails = ({ delivery, onStatusUpdate }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_way':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'assigned':
        return { value: 'picked_up', label: 'Olingan', color: 'bg-yellow-500 hover:bg-yellow-600' };
      case 'picked_up':
        return { value: 'on_way', label: 'Yo\'lda', color: 'bg-orange-500 hover:bg-orange-600' };
      case 'on_way':
        return { value: 'delivered', label: 'Yetkazildi', color: 'bg-green-500 hover:bg-green-600' };
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(delivery.status);

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Buyurtma sarlavhasi */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Buyurtma #{delivery.order.id}</h2>
            <p className="text-gray-600 mt-1">
              {formatDistance(new Date(delivery.created_at), new Date(), {
                addSuffix: true,
                locale: uz
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full font-medium ${getStatusBadgeColor(delivery.status)}`}>
            {delivery.status_display}
          </span>
        </div>
      </div>

      {/* Vaqt jadvali */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">Vaqt jadvali</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              delivery.created_at ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <span className="material-icons text-xl">assignment</span>
            </div>
            <div className="ml-4">
              <p className="font-medium">Buyurtma yaratildi</p>
              <p className="text-sm text-gray-600">
                {new Date(delivery.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              delivery.pickup_time ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <span className="material-icons text-xl">store</span>
            </div>
            <div className="ml-4">
              <p className="font-medium">Restorandan olindi</p>
              <p className="text-sm text-gray-600">
                {delivery.pickup_time ? new Date(delivery.pickup_time).toLocaleString() : 'Kutilmoqda'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              delivery.delivery_time ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <span className="material-icons text-xl">check_circle</span>
            </div>
            <div className="ml-4">
              <p className="font-medium">Yetkazib berildi</p>
              <p className="text-sm text-gray-600">
                {delivery.delivery_time ? new Date(delivery.delivery_time).toLocaleString() : 'Kutilmoqda'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restoran ma'lumotlari */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">Restoran ma'lumotlari</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start">
            <span className="material-icons text-gray-400 mr-3">store</span>
            <div>
              <p className="font-medium">{delivery.order.restaurant_name}</p>
              <p className="text-gray-600 mt-1">{delivery.order.restaurant_address}</p>
              <p className="text-gray-600 mt-1">Tel: {delivery.order.restaurant_phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mijoz ma'lumotlari */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">Mijoz ma'lumotlari</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start">
            <span className="material-icons text-gray-400 mr-3">person</span>
            <div>
              <p className="font-medium">{delivery.order.customer_name}</p>
              <p className="text-gray-600 mt-1">{delivery.order.delivery_address}</p>
              <p className="text-gray-600 mt-1">Tel: {delivery.order.customer_phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buyurtma tafsilotlari */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold mb-4">Buyurtma tafsilotlari</h3>
        <div className="space-y-4">
          {delivery.order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-gray-400">restaurant</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} x {item.price} so'm</p>
                </div>
              </div>
              <p className="font-medium">{item.quantity * item.price} so'm</p>
            </div>
          ))}

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-gray-600">
              <span>Taomlar narxi:</span>
              <span>{delivery.order.subtotal} so'm</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Yetkazib berish:</span>
              <span>{delivery.order.delivery_fee} so'm</span>
            </div>
            <div className="flex justify-between font-semibold mt-2 text-lg">
              <span>Jami:</span>
              <span>{delivery.order.total_amount} so'm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Harakatlar */}
      <div className="p-6 flex justify-end space-x-4">
        {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
          <>
            <button
              onClick={() => onStatusUpdate(delivery.id, 'failed')}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
            >
              Bekor qilish
            </button>
            {nextStatus && (
              <button
                onClick={() => onStatusUpdate(delivery.id, nextStatus.value)}
                className={`px-6 py-2 text-white rounded-lg ${nextStatus.color}`}
              >
                {nextStatus.label}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;