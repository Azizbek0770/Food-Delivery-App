import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatistics } from '../../store/slices/adminSlice';
import StatisticsFilters from '../../components/admin/statistics/StatisticsFilters';
import RevenueChart from '../../components/admin/statistics/RevenueChart';
import OrdersChart from '../../components/admin/statistics/OrdersChart';
import TopRestaurants from '../../components/admin/statistics/TopRestaurants';
import TopDeliveryPersons from '../../components/admin/statistics/TopDeliveryPersons';
import StatisticsCards from '../../components/admin/statistics/StatisticsCards';

const Statistics = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector(state => state.admin);
  const [filters, setFilters] = useState({
    dateRange: 'week',
    startDate: null,
    endDate: null,
    restaurant: 'all',
    region: 'all'
  });

  useEffect(() => {
    dispatch(fetchStatistics(filters));
  }, [dispatch, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Statistika</h1>
      </div>

      {/* Filterlar */}
      <StatisticsFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Statistika kartlari */}
      <div className="mt-8">
        <StatisticsCards statistics={statistics} />
      </div>

      {/* Asosiy grafiklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Daromad statistikasi</h2>
          <RevenueChart data={statistics?.revenueData || []} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Buyurtmalar statistikasi</h2>
          <OrdersChart data={statistics?.ordersData || []} />
        </div>
      </div>

      {/* Top restoranlar va yetkazib beruvchilar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Top restoranlar</h2>
          <TopRestaurants restaurants={statistics?.topRestaurants || []} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Top yetkazib beruvchilar</h2>
          <TopDeliveryPersons deliveryPersons={statistics?.topDeliveryPersons || []} />
        </div>
      </div>

      {/* Qo'shimcha statistika */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {/* Buyurtmalar statusi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Buyurtmalar statusi</h2>
          <div className="space-y-4">
            {statistics?.orderStatusStats?.map((stat) => (
              <div key={stat.status} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{stat.status_display}</span>
                    <span className="text-sm text-gray-500">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 rounded-full h-2"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* To'lov usullari */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">To'lov usullari</h2>
          <div className="space-y-4">
            {statistics?.paymentMethodStats?.map((stat) => (
              <div key={stat.method} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{stat.method_display}</span>
                    <span className="text-sm text-gray-500">{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 rounded-full h-2"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mijozlar statistikasi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Mijozlar statistikasi</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Yangi mijozlar</p>
                <p className="text-2xl font-bold mt-1">
                  {statistics?.customerStats?.newCustomers || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{statistics?.customerStats?.newCustomersGrowth || 0}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Faol mijozlar</p>
                <p className="text-2xl font-bold mt-1">
                  {statistics?.customerStats?.activeCustomers || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{statistics?.customerStats?.activeCustomersGrowth || 0}%
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Buyurtmalar soni bo'yicha
              </h3>
              <div className="space-y-2">
                {statistics?.customerStats?.orderFrequency?.map((stat) => (
                  <div key={stat.range} className="flex justify-between text-sm">
                    <span className="text-gray-600">{stat.range}</span>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;