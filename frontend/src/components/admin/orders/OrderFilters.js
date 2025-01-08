import React from 'react';
import { debounce } from 'lodash';
import DateRangePicker from '../../common/DateRangePicker';

const OrderFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = debounce((value) => {
    onFilterChange({ ...filters, search: value });
  }, 300);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Qidiruv */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <span className="material-icons text-gray-400">search</span>
          </span>
          <input
            type="text"
            placeholder="Buyurtma, mijoz yoki restoran..."
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
            <option value="pending">Kutilmoqda</option>
            <option value="preparing">Tayyorlanmoqda</option>
            <option value="delivering">Yetkazilmoqda</option>
            <option value="completed">Yakunlangan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
        </div>

        {/* Vaqt oralig'i */}
        <div>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="today">Bugun</option>
            <option value="yesterday">Kecha</option>
            <option value="week">Oxirgi hafta</option>
            <option value="month">Oxirgi oy</option>
            <option value="custom">Boshqa</option>
          </select>
        </div>

        {/* To'lov usuli */}
        <div>
          <select
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange({ ...filters, paymentMethod: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Barcha to'lov usullari</option>
            <option value="cash">Naqd pul</option>
            <option value="card">Karta</option>
            <option value="online">Online to'lov</option>
          </select>
        </div>

        {/* Saralash */}
        <div>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="created_at">Vaqt bo'yicha</option>
            <option value="total_amount">Summa bo'yicha</option>
            <option value="status">Status bo'yicha</option>
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

      {/* Custom date range picker */}
      {filters.dateRange === 'custom' && (
        <div className="mt-4">
          <DateRangePicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onChange={({ startDate, endDate }) => 
              onFilterChange({ ...filters, startDate, endDate })
            }
          />
        </div>
      )}
    </div>
  );
};

export default OrderFilters;