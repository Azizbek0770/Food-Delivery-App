import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/adminSlice';
import OrderFilters from '../../components/admin/orders/OrderFilters';
import OrderDetails from '../../components/admin/orders/OrderDetails';
import { formatCurrency } from '../../utils/format';
import { formatDistance } from 'date-fns';
import { uz } from 'date-fns/locale';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.admin);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    restaurant: '',
    dateRange: 'today',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    dispatch(fetchOrders(filters));
  }, [dispatch, filters]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Buyurtmalar boshqaruvi</h1>
      </div>

      {/* Filterlar */}
      <OrderFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Buyurtmalar ro'yxati */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buyurtma ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restoran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mijoz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Summa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vaqt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {order.restaurant_image ? (
                            <img
                              src={order.restaurant_image}
                              alt={order.restaurant_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="material-icons text-gray-400">restaurant</span>
                            </div>
                          )}
                          <span className="ml-2">{order.restaurant_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="material-icons text-gray-400">person</span>
                          </div>
                          <span className="ml-2">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(order.created_at), new Date(), {
                          addSuffix: true,
                          locale: uz
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="text-center py-8">
                  <span className="material-icons text-gray-400 text-5xl">
                    receipt_long
                  </span>
                  <p className="mt-2 text-gray-500">Buyurtmalar topilmadi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buyurtma tafsilotlari */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <OrderDetails
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <span className="material-icons text-gray-400 text-5xl">
                receipt
              </span>
              <p className="mt-2 text-gray-500">
                Tafsilotlarni ko'rish uchun buyurtmani tanlang
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;