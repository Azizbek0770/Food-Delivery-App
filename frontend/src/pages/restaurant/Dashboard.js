import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDashboard, toggleRestaurantStatus } from '../../store/slices/restaurantSlice';
import OrdersList from '../../components/restaurant/dashboard/OrdersList';
import Statistics from '../../components/restaurant/dashboard/Statistics';
import MenuManager from '../../components/restaurant/dashboard/MenuManager';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector(state => state.restaurant);
  const { user } = useSelector(state => state.auth);
  const restaurantId = user.restaurants[0]?.id; // Hozircha bitta restaurant uchun

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantDashboard(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const handleStatusToggle = async () => {
    try {
      await dispatch(toggleRestaurantStatus(restaurantId)).unwrap();
      dispatch(fetchRestaurantDashboard(restaurantId));
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Xatolik yuz berdi: {error.message}
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{dashboard.name}</h1>
          <p className="text-gray-600">
            Reyting: {dashboard.rating} ({dashboard.total_ratings} ta baholash)
          </p>
        </div>
        <button
          onClick={handleStatusToggle}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            dashboard.is_active
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          <span className="material-icons">
            {dashboard.is_active ? 'check_circle' : 'cancel'}
          </span>
          <span>{dashboard.is_active ? 'Faol' : 'Faol emas'}</span>
        </button>
      </div>

      {/* Statistika */}
      <div className="mb-8">
        <Statistics
          todayOrders={dashboard.today_orders}
          todayRevenue={dashboard.today_revenue}
          totalOrders={dashboard.total_orders}
          totalRevenue={dashboard.total_revenue}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Buyurtmalar ro'yxati */}
        <div className="lg:col-span-2">
          <OrdersList restaurantId={restaurantId} />
        </div>

        {/* Menu boshqaruvi */}
        <div className="lg:col-span-1">
          <MenuManager
            popularProducts={dashboard.popular_products}
            restaurantId={restaurantId}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;