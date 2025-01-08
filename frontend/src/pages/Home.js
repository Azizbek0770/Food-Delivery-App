import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import SearchFilters from '../components/restaurant/SearchFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    cuisine: 'all',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants/', {
        params: {
          search: searchQuery,
          ...filters
        }
      });
      setRestaurants(response.data);
    } catch (error) {
      toast.error('Restoranlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRestaurants();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sevimli taomlaringizni yetkazib beramiz
        </h1>
        <p className="text-xl text-gray-600">
          Eng yaxshi restoranlardan mazali taomlar
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <SearchFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      </div>

      {/* Restaurant grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && restaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Restoranlar topilmadi. Iltimos, boshqa parametrlar bilan qidirib ko'ring.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home; 