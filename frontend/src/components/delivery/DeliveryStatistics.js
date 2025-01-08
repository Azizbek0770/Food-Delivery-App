import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDeliveryStatistics } from '../../store/slices/deliverySlice';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full ${color.replace('text', 'bg')} bg-opacity-20 flex items-center justify-center`}>
        <span className="material-icons text-2xl">{icon}</span>
      </div>
    </div>
  </div>
);

const DeliveryStatistics = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector(state => state.delivery);

  useEffect(() => {
    dispatch(getDeliveryStatistics());
    // Har 5 daqiqada yangilab turish
    const interval = setInterval(() => {
      dispatch(getDeliveryStatistics());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading || !statistics) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bugungi buyurtmalar"
          value={statistics.today.total}
          icon="today"
          color="text-blue-600"
        />
        <StatCard
          title="Yetkazilgan"
          value={statistics.today.delivered}
          icon="check_circle"
          color="text-green-600"
        />
        <StatCard
          title="Faol buyurtmalar"
          value={statistics.today.active}
          icon="local_shipping"
          color="text-yellow-600"
        />
        <StatCard
          title="Bekor qilingan"
          value={statistics.today.failed}
          icon="cancel"
          color="text-red-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Umumiy statistika</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Jami buyurtmalar</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {statistics.total.total}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Muvaffaqiyatli yetkazilgan</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {statistics.total.delivered}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Muvaffaqiyat darajasi</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {statistics.total.success_rate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatistics;