import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/orders/${order.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Buyurtma #{order.id}
            </h3>
            <p className="text-gray-600 mt-1">
              {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 font-medium">{order.restaurant_name}</p>
          <p className="text-gray-600 mt-1">{order.delivery_address}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-600">
            {order.items.length} ta mahsulot
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {order.total_amount} so'm
          </span>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;