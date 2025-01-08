import React from 'react';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';

const RestaurantsTable = ({ restaurants }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Restoran
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manzil
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qo'shilgan vaqti
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="material-icons text-gray-400">restaurant</span>
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {restaurant.phone}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{restaurant.address}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  restaurant.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.is_active ? 'Faol' : 'Faol emas'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistance(new Date(restaurant.created_at), new Date(), {
                  addSuffix: true,
                  locale: uz
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {restaurants.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Yangi restoranlar mavjud emas
        </div>
      )}
    </div>
  );
};

export default RestaurantsTable;