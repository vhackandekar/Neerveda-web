
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps<T> {
  data: T[];
  dataKey: keyof T;
  xAxisDataKey: keyof T;
  unit?: string;
  barColor?: string;
}

const BarChart = <T,>({ data, dataKey, xAxisDataKey, unit, barColor = '#2196F3' }: ChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey={xAxisDataKey as string} stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} unit={unit} />
        <Tooltip
          formatter={(value) => [`${value} ${unit || ''}`, 'Index']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '0.5rem',
          }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}} />
        <Bar dataKey={dataKey as string} fill={barColor} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
