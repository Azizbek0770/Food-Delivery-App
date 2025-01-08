import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/adminSlice';
import UserFilters from '../../components/admin/users/UserFilters';
import UserDetails from '../../components/admin/users/UserDetails';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.admin);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'restaurant_owner':
        return 'bg-blue-100 text-blue-800';
      case 'delivery_person':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Foydalanuvchilar boshqaruvi</h1>
      </div>

      {/* Filterlar */}
      <UserFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Foydalanuvchilar ro'yxati */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foydalanuvchi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qo'shilgan vaqti
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oxirgi faollik
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="material-icons text-gray-400">person</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {user.role_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                          {user.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(user.created_at), new Date(), {
                          addSuffix: true,
                          locale: uz
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(user.last_active), new Date(), {
                          addSuffix: true,
                          locale: uz
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-8">
                  <span className="material-icons text-gray-400 text-5xl">
                    group
                  </span>
                  <p className="mt-2 text-gray-500">
                    Foydalanuvchilar topilmadi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Foydalanuvchi tafsilotlari */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <UserDetails
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <span className="material-icons text-gray-400 text-5xl">
                person
              </span>
              <p className="mt-2 text-gray-500">
                Tafsilotlarni ko'rish uchun foydalanuvchini tanlang
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;