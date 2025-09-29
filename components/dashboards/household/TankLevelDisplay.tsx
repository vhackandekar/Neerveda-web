import React from 'react';

interface TankLevelDisplayProps {
  label: string;
  current: number;
  capacity: number;
  colorFrom: string;
  colorTo: string;
}

const TankLevelDisplay: React.FC<TankLevelDisplayProps> = ({ label, current, capacity, colorFrom, colorTo }) => {
  const percentage = capacity > 0 ? (current / capacity) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-end h-full w-full">
      {/* Tank visual */}
      <div className="relative w-full h-full bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden flex flex-col justify-end">
        {/* Water fill */}
        <div
          className={`relative bg-gradient-to-t ${colorFrom} ${colorTo} transition-all duration-700 ease-out overflow-hidden`}
          style={{ height: `${percentage}%` }}
        >
          {/* Shimmer Animation */}
          <div className="absolute top-0 -left-full w-[200%] h-full bg-white/20 -skew-x-12 animate-shimmer"></div>

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white drop-shadow-lg">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="text-center mt-2">
        <p className="font-semibold text-gray-700 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{current}L / {capacity}L</p>
      </div>
    </div>
  );
};

export default TankLevelDisplay;