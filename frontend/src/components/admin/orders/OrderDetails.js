import React from 'react';
import { formatCurrency } from '../../../utils/format';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';

const OrderDetails = ({ order, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">Buyurtma #{order.id}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {formatDistance(new Date(order.created_at), new Date(), {
              addSuffix: true,
              locale: uz
            })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {order.status_display}
            </span>
            {order.status === 'cancelled' && (
              <p className="text-sm text-red-600">{order.cancellation_reason}</p>
            )}
          </div>
        </div>

        {/* Restoran */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Restoran</h3>
          <div className="flex items-center">
            {order.restaurant_image ? (
              <img
                src={order.restaurant_image}
                alt={order.restaurant_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="material-icons text-gray-400">restaurant</span>
              </div>
            )}
            <div className="ml-3">
              <p className="font-medium">{order.restaurant_name}</p>
              <p className="text-sm text-gray-600">{order.restaurant_address}</p>
            </div>
          </div>
        </div>

        {/* Mijoz */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Mijoz</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="material-icons text-gray-400">person</span>
            </div>
            <div className="ml-3">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-gray-600">{order.customer_phone}</p>
            </div>
          </div>
        </div>

        {/* Yetkazib beruvchi */}
        {order.delivery_person && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Yetkazib beruvchi
            </h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="material-icons text-gray-400">
                  delivery_dining
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium">{order.delivery_person.name}</p>
                <p className="text-sm text-gray-600">
                  {order.delivery_person.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mahsulotlar */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Mahsulotlar</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="material-icons text-gray-400">
                        restaurant_menu
                      </span>
                    </div>
                  )}
                  <div className="ml-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* To'lov ma'lumotlari */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            To'lov ma'lumotlari
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mahsulotlar narxi:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Yetkazib berish:</span>
              <span>{formatCurrency(order.delivery_fee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Chegirma:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Jami:</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* To'lov usuli */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">To'lov usuli</h3>
          <div className="flex items-center space-x-2">
            <span className="material-icons text-gray-400">
              {order.payment_method === 'cash' ? 'payments' : 'credit_card'}
            </span>
            <span>{order.payment_method_display}</span>
          </div>
        </div>

        {/* Yetkazib berish manzili */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Yetkazib berish manzili
          </h3>
          <p className="text-gray-600">{order.delivery_address}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;