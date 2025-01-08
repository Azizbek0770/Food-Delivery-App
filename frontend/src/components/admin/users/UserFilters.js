import React from 'react';
import { debounce } from 'lodash';

const UserFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = debounce((value) => {
    onFilterChange({ ...filters, search: value });
  }, 300);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Qidiruv */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="material-icons text-gray-400">search</span>
          </span>
          <input
            type="text"
            placeholder="Ism, email yoki telefon..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Rol filter */}
        <div>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Barcha rollar</option>
            <option value="admin">Adminlar</option>
            <option value="restaurant_owner">Restoran egalari</option>
            <option value="delivery_person">Yetkazib beruvchilar</option>
            <option value="customer">Mijozlar</option>
          </select>
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
            <option value="blocked">Bloklangan</option>
            <option value="pending">Kutilmoqda</option>
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
            <option value="last_active">Oxirgi faollik</option>
            <option value="name">Ism</option>
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

export default UserFilters;