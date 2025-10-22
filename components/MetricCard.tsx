
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon }) => {
  return (
    <div className="bg-bg-light rounded-lg shadow-lg p-4 flex items-center">
      <div className="p-3 mr-4 text-brand-primary bg-gray-800 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-semibold text-text-primary">
          {value ?? 'N/A'}
          {value !== null && unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default MetricCard;
