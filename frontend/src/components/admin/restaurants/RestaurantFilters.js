import React from 'react';
import { debounce } from 'lodash';

const RestaurantFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = debounce((value) => {
    onFilterChange({ ...filters, search: value });
  }, 300);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Qidiruv */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="material-icons text-gray-400">search</span>
          </span>
          <input
            type="text"
            placeholder="Restoranni qidirish..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Status filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
            <option value="pending">Kutilmoqda</option>
            <option value="blocked">Bloklangan</option>
          </select>
        </div>

        {/* Saralash */}
        <div>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="created_at">Qo'shilgan vaqti</option>
            <option value="name">Nomi</option>
            <option value="rating">Reyting</option>
            <option value="orders_count">Buyurtmalar soni</option>
          </select>
        </div>

        {/* Tartib */}
        <div>
          <select
            value={filters.sortOrder}
            onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="desc">Kamayish bo'yicha</option>
            <option value="asc">O'sish bo'yicha</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilters;