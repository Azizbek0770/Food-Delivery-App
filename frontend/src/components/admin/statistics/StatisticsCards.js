import React from 'react';
import DateRangePicker from '../../common/DateRangePicker';

const StatisticsFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="year">Oxirgi yil</option>
            <option value="custom">Boshqa</option>
          </select>
        </div>

        {/* Restoran */}
        <div>
          <select
            value={filters.restaurant}
            onChange={(e) => onFilterChange({ ...filters, restaurant: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Barcha restoranlar</option>
            {/* Restoranlar ro'yxati dinamik ravishda yuklanadi */}
          </select>
        </div>

        {/* Hudud */}
        <div>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
            className="w-full py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Barcha hududlar</option>
            {/* Hududlar ro'yxati dinamik ravishda yuklanadi */}
          </select>
        </div>

        {/* Eksport */}
        <div>
          <button
            className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="material-icons text-sm mr-1">download</span>
            Eksport (Excel)
          </button>
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

export default StatisticsFilters;