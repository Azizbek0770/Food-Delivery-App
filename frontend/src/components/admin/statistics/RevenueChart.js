import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../utils/format';

const RevenueChart = ({ data }) => {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label) => `Sana: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Umumiy daromad"
            stroke="#10B981"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="deliveryFees"
            name="Yetkazib berish to'lovi"
            stroke="#6366F1"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="commission"
            name="Komissiya"
            stroke="#F59E0B"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;