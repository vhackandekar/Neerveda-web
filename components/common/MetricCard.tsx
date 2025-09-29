
import React from 'react';
import StatusIndicator from './StatusIndicator';
import { StatusIndicator as StatusIndicatorType } from '../../types';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  status: StatusIndicatorType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, status }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <StatusIndicator status={status} />
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        {unit && <span className="ml-1 text-lg text-gray-500">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
