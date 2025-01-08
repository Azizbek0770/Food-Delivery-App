import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';
import { formatCurrency } from '../../../utils/format';

const RestaurantDetails = ({ restaurant, onClose, onApprove, onBlock }) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{restaurant.name}</h2>
          <p className="text-sm text-gray-600 mt-1">
            ID: #{restaurant.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <span className="material-icons">close</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'info'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ma'lumotlar
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'stats'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Statistika
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'reviews'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sharhlar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Asosiy ma'lumotlar */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Asosiy ma'lumotlar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Manzil</p>
                  <p className="mt-1">{restaurant.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="mt-1">{restaurant.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Qo'shilgan vaqti</p>
                  <p className="mt-1">
                    {formatDistance(new Date(restaurant.created_at), new Date(), {
                      addSuffix: true,
                      locale: uz
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`mt-1 inline-flex items-center ${
                    restaurant.is_active
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                    <span className="material-icons text-sm mr-1">
                      {restaurant.is_active ? 'check_circle' : 'cancel'}
                    </span>
                    {restaurant.is_active ? 'Faol' : 'Faol emas'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ish vaqti */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Ish vaqti
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {restaurant.working_hours.map((hours) => (
                  <div key={hours.day} className="flex justify-between text-sm">
                    <span className="text-gray-500">{hours.day_name}</span>
                    <span>
                      {hours.is_closed
                        ? 'Yopiq'
                        : `${hours.opening_time} - ${hours.closing_time}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Harakatlar */}
            <div className="pt-4 border-t">
              <button
                onClick={() => restaurant.is_active
                  ? onBlock(restaurant.id)
                  : onApprove(restaurant.id)
                }
                className={`w-full py-2 rounded-lg ${
                  restaurant.is_active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <span className="material-icons text-sm mr-1">
                  {restaurant.is_active ? 'block' : 'check_circle'}
                </span>
                {restaurant.is_active ? 'Bloklash' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Statistika */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Buyurtmalar soni</p>
                <p className="text-2xl font-bold mt-1">
                  {restaurant.orders_count}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Umumiy daromad</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(restaurant.total_revenue)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">O'rtacha buyurtma</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(restaurant.average_order_amount)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Reyting</p>
                <p className="text-2xl font-bold mt-1 flex items-center">
                  <span className="material-icons text-yellow-400 mr-1">
                    star
                  </span>
                  {restaurant.rating} ({restaurant.total_ratings})
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {restaurant.reviews.map((review) => (
              <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="material-icons text-gray-400">person</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{review.user_name}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-icons text-sm ${
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDistance(new Date(review.created_at), new Date(), {
                      addSuffix: true,
                      locale: uz
                    })}
                  </p>
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            ))}

            {restaurant.reviews.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Sharhlar mavjud emas
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;