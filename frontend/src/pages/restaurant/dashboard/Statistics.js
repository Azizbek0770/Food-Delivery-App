import React from 'react';
import { formatCurrency } from '../../../utils/format';

const StatCard = ({ title, value, icon, color, subValue, subLabel }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
        <span className={`material-icons ${color.replace('bg', 'text')}`}>{icon}</span>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
    {subValue && (
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{subLabel}</span>
          <span className="font-medium">{subValue}</span>
        </div>
      </div>
    )}
  </div>
);

const Statistics = ({ todayOrders, todayRevenue, totalOrders, totalRevenue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Bugungi buyurtmalar"
        value={todayOrders}
        icon="shopping_cart"
        color="bg-blue-600"
        subValue={`${totalOrders} ta`}
        subLabel="Jami buyurtmalar"
      />
      <StatCard
        title="Bugungi tushum"
        value={formatCurrency(todayRevenue)}
        icon="payments"
        color="bg-green-600"
        subValue={formatCurrency(totalRevenue)}
        subLabel="Jami tushum"
      />
      <StatCard
        title="O'rtacha buyurtma"
        value={formatCurrency(todayOrders ? todayRevenue / todayOrders : 0)}
        icon="analytics"
        color="bg-yellow-600"
      />
      <StatCard
        title="Faol buyurtmalar"
        value="12" // Bu qiymatni API dan olish kerak
        icon="local_shipping"
        color="bg-purple-600"
      />
    </div>
  );
};

export default Statistics;