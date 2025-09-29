
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps<T> {
  data: T[];
  dataKey: keyof T;
  xAxisDataKey: keyof T;
  unit?: string;
  lineColor?: string;
}

const LineChart = <T,>({ data, dataKey, xAxisDataKey, unit, lineColor = '#4CAF50' }: ChartProps<T>) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey={xAxisDataKey as string} stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} unit={unit} />
        <Tooltip
          formatter={(value) => [`${value} ${unit || ''}`, 'Value']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '0.5rem',
          }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}} />
        <Line type="monotone" dataKey={dataKey as string} stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
