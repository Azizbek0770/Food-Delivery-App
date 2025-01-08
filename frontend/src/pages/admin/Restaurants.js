import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRestaurants,
  approveRestaurant,
  blockRestaurant
} from '../../store/slices/adminSlice';
import RestaurantDetails from '../../components/admin/restaurants/RestaurantDetails';
import RestaurantFilters from '../../components/admin/restaurants/RestaurantFilters';

const Restaurants = () => {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector(state => state.admin);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    dispatch(fetchRestaurants(filters));
  }, [dispatch, filters]);

  const handleApprove = async (restaurantId) => {
    try {
      await dispatch(approveRestaurant(restaurantId)).unwrap();
      dispatch(fetchRestaurants(filters));
    } catch (error) {
      console.error('Failed to approve restaurant:', error);
    }
  };

  const handleBlock = async (restaurantId) => {
    try {
      await dispatch(blockRestaurant(restaurantId)).unwrap();
      dispatch(fetchRestaurants(filters));
    } catch (error) {
      console.error('Failed to block restaurant:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Restoranlar boshqaruvi</h1>
      </div>

      {/* Filterlar */}
      <RestaurantFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Restoranlar ro'yxati */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
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
                      Reyting
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurants.map((restaurant) => (
                    <tr
                      key={restaurant.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="material-icons text-yellow-400 text-sm mr-1">
                            star
                          </span>
                          <span className="text-sm text-gray-900">
                            {restaurant.rating} ({restaurant.total_ratings})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            restaurant.is_active
                              ? handleBlock(restaurant.id)
                              : handleApprove(restaurant.id);
                          }}
                          className={`inline-flex items-center px-3 py-1 rounded-md ${
                            restaurant.is_active
                              ? 'text-red-700 bg-red-100 hover:bg-red-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          <span className="material-icons text-sm mr-1">
                            {restaurant.is_active ? 'block' : 'check_circle'}
                          </span>
                          {restaurant.is_active ? 'Bloklash' : 'Tasdiqlash'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {restaurants.length === 0 && (
                <div className="text-center py-8">
                  <span className="material-icons text-gray-400 text-5xl">
                    restaurant
                  </span>
                  <p className="mt-2 text-gray-500">Restoranlar topilmadi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Restoran tafsilotlari */}
        <div className="lg:col-span-1">
          {selectedRestaurant ? (
            <RestaurantDetails
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
              onApprove={handleApprove}
              onBlock={handleBlock}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <span className="material-icons text-gray-400 text-5xl">
                store
              </span>
              <p className="mt-2 text-gray-500">
                Tafsilotlarni ko'rish uchun restoranni tanlang
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;