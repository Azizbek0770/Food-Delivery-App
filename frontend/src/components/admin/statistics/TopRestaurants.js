import React from 'react';
import { formatCurrency } from '../../../utils/format';

const TopRestaurants = ({ restaurants }) => {
  return (
    <div className="space-y-4">
      {restaurants.map((restaurant, index) => (
        <div
          key={restaurant.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center font-semibold text-gray-500">
              #{index + 1}
            </div>
            <div className="ml-4 flex items-center">
              {restaurant.image ? (
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400">restaurant</span>
                </div>
              )}
              <div className="ml-3">
                <p className="font-medium">{restaurant.name}</p>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatCurrency(restaurant.revenue)}</p>
            <p className="text-sm text-gray-600">{restaurant.orders_count} buyurtma</p>
          </div>
        </div>
      ))}

      {restaurants.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Ma'lumotlar mavjud emas
        </div>
      )}
    </div>
  );
};

export default TopRestaurants;