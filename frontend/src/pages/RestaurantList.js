import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurants, setFilters } from '../store/slices/restaurantSlice';
import RestaurantCard from '../components/restaurants/RestaurantCard';

const RestaurantList = () => {
  const dispatch = useDispatch();
  const { restaurants, loading, error, filters } = useSelector(state => state.restaurant);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    dispatch(getRestaurants(filters));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleSort = (e) => {
    dispatch(setFilters({ sorting: e.target.value }));
  };

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik yuz berdi: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Restoranni qidirish..."
            className="flex-1 p-2 border rounded"
          />
          <select
            value={filters.sorting}
            onChange={handleSort}
            className="p-2 border rounded"
          >
            <option value="rating">Reyting bo'yicha</option>
            <option value="delivery_time">Yetkazib berish vaqti bo'yicha</option>
            <option value="min_order">Minimal buyurtma bo'yicha</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Qidirish
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;