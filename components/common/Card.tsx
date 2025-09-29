
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
