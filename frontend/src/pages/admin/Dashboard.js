import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardStats,
  fetchLatestOrders,
  fetchNewRestaurants
} from '../../store/slices/adminSlice';
import StatisticsCards from '../../components/admin/dashboard/StatisticsCards';
import OrdersTable from '../../components/admin/dashboard/OrdersTable';
import RestaurantsTable from '../../components/admin/dashboard/RestaurantsTable';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, latestOrders, newRestaurants, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchLatestOrders());
    dispatch(fetchNewRestaurants());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistika kartlari */}
      <StatisticsCards stats={stats} />

      {/* Daromad grafigi */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Daromad statistikasi</h2>
          <RevenueChart data={stats?.revenueData || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Oxirgi buyurtmalar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Oxirgi buyurtmalar</h2>
          <OrdersTable orders={latestOrders} />
        </div>

        {/* Yangi restoranlar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Yangi restoranlar</h2>
          <RestaurantsTable restaurants={newRestaurants} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;