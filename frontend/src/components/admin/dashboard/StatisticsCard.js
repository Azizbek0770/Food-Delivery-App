import React from 'react';
import { formatCurrency } from '../../../utils/format';

const StatCard = ({ title, value, icon, color, percentage }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {percentage && (
          <p className={`text-sm mt-2 ${
            percentage > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="flex items-center">
              <span className="material-icons text-base mr-1">
                {percentage > 0 ? 'trending_up' : 'trending_down'}
              </span>
              {Math.abs(percentage)}% o'tgan oyga nisbatan
            </span>
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
        <span className={`material-icons ${color.replace('bg', 'text')}`}>{icon}</span>
      </div>
    </div>
  </div>
);

const StatisticsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Jami buyurtmalar"
        value={stats.totalOrders}
        icon="shopping_cart"
        color="bg-blue-600"
        percentage={stats.ordersGrowth}
      />
      <StatCard
        title="Umumiy daromad"
        value={formatCurrency(stats.totalRevenue)}
        icon="payments"
        color="bg-green-600"
        percentage={stats.revenueGrowth}
      />
      <StatCard
        title="Faol restoranlar"
        value={stats.activeRestaurants}
        icon="restaurant"
        color="bg-yellow-600"
        percentage={stats.restaurantsGrowth}
      />
      <StatCard
        title="Faol yetkazuvchilar"
        value={stats.activeDeliveryPersons}
        icon="delivery_dining"
        color="bg-purple-600"
        percentage={stats.deliveryPersonsGrowth}
      />
    </div>
  );
};

export default StatisticsCards;