import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { blockUser, unblockUser, updateUserRole } from '../../../store/slices/adminSlice';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';
import { formatCurrency } from '../../../utils/format';

const UserDetails = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('info');

  const handleStatusChange = async () => {
    try {
      if (user.status === 'blocked') {
        await dispatch(unblockUser(user.id)).unwrap();
      } else {
        await dispatch(blockUser(user.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleRoleChange = async (newRole) => {
    try {
      await dispatch(updateUserRole({
        userId: user.id,
        role: newRole
      })).unwrap();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-600 mt-1">ID: #{user.id}</p>
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
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Buyurtmalar
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'activity'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Faollik
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Asosiy ma'lumotlar */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Asosiy ma'lumotlar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="mt-1">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Qo'shilgan vaqti</p>
                  <p className="mt-1">
                    {formatDistance(new Date(user.created_at), new Date(), {
                      addSuffix: true,
                      locale: uz
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Oxirgi faollik</p>
                  <p className="mt-1">
                    {formatDistance(new Date(user.last_active), new Date(), {
                      addSuffix: true,
                      locale: uz
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Rol va status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Rol va status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Rol</p>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="mt-1 w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="restaurant_owner">Restoran egasi</option>
                    <option value="delivery_person">Yetkazib beruvchi</option>
                    <option value="customer">Mijoz</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <button
                    onClick={handleStatusChange}
                    className={`mt-1 w-full py-2 px-4 rounded-lg ${
                      user.status === 'blocked'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {user.status === 'blocked' ? 'Blokdan chiqarish' : 'Bloklash'}
                  </button>
                </div>
              </div>
            </div>

            {/* Qo'shimcha ma'lumotlar */}
            {user.role === 'restaurant_owner' && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Restoran ma'lumotlari
                </h3>
                <div className="space-y-2">
                  {user.restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        {restaurant.image ? (
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="material-icons text-gray-400">
                              restaurant
                            </span>
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="font-medium">{restaurant.name}</p>
                          <p className="text-sm text-gray-600">
                            {restaurant.address}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        restaurant.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.is_active ? 'Faol' : 'Faol emas'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {user.recent_orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Buyurtma #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {formatDistance(new Date(order.created_at), new Date(), {
                        addSuffix: true,
                        locale: uz
                      })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status_display}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {order.restaurant_name}
                  </p>
                  <p className="font-medium mt-1">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            ))}

            {user.recent_orders.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Buyurtmalar mavjud emas
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {user.activity_log.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3"
              >
                <div className={`w-8 h-8 rounded-full ${
                  activity.type === 'login'
                    ? 'bg-blue-100'
                    : activity.type === 'order'
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                } flex items-center justify-center`}>
                  <span className={`material-icons text-sm ${
                    activity.type === 'login'
                      ? 'text-blue-600'
                      : activity.type === 'order'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}>
                    {activity.type === 'login'
                      ? 'login'
                      : activity.type === 'order'
                      ? 'shopping_cart'
                      : 'info'}
                  </span>
                </div>
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistance(new Date(activity.created_at), new Date(), {
                      addSuffix: true,
                      locale: uz
                    })}
                  </p>
                </div>
              </div>
            ))}

            {user.activity_log.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Faollik tarixi mavjud emas
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;