import React, { useState } from 'react';
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/outline';
import InputField from '../common/InputField';

const SearchFilters = ({ onSearch, onFilter }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    cuisine: 'all',
    sortBy: 'rating'
  });

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <InputField
          placeholder="Restoran yoki taom qidirish..."
          className="pl-10"
          onChange={handleSearchChange}
        />
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <AdjustmentsIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
          {/* Narx oralig'i */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narx oralig'i
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="all">Hammasi</option>
              <option value="low">$ (Arzon)</option>
              <option value="medium">$$ (O'rtacha)</option>
              <option value="high">$$$ (Qimmat)</option>
            </select>
          </div>

          {/* Reyting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reyting
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="all">Hammasi</option>
              <option value="4">4+ yulduz</option>
              <option value="3">3+ yulduz</option>
              <option value="2">2+ yulduz</option>
            </select>
          </div>

          {/* Oshxona turi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oshxona turi
            </label>
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="all">Hammasi</option>
              <option value="uzbek">O'zbek</option>
              <option value="european">Yevropa</option>
              <option value="asian">Osiyo</option>
              <option value="fast-food">Fast Food</option>
            </select>
          </div>

          {/* Saralash */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saralash
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="rating">Reyting bo'yicha</option>
              <option value="delivery_time">Yetkazib berish vaqti</option>
              <option value="min_order">Minimal buyurtma</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters; 