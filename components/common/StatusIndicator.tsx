
import React from 'react';
import { StatusIndicator as StatusIndicatorEnum } from '../../types';

interface StatusIndicatorProps {
  status: StatusIndicatorEnum;
  size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md' }) => {
  const colorMap = {
    [StatusIndicatorEnum.GREEN]: 'bg-status-green',
    [StatusIndicatorEnum.YELLOW]: 'bg-status-yellow',
    [StatusIndicatorEnum.RED]: 'bg-status-red',
  };
  
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`rounded-full ${colorMap[status]} ${sizeMap[size]}`} />
  );
};

export default StatusIndicator;
