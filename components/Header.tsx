
import React from 'react';
import { AppStatus } from '../types';

interface HeaderProps {
  status: AppStatus;
}

const statusConfig = {
    [AppStatus.Disconnected]: { text: 'Disconnected', color: 'bg-gray-500' },
    [AppStatus.Connecting]: { text: 'Connecting...', color: 'bg-yellow-500 animate-pulse' },
    [AppStatus.Training]: { text: 'Training Model...', color: 'bg-blue-500 animate-pulse' },
    [AppStatus.Predicting]: { text: 'Predicting', color: 'bg-accent-green' },
    [AppStatus.Stopping]: { text: 'Stopping...', color: 'bg-yellow-500' },
    [AppStatus.Error]: { text: 'Error', color: 'bg-accent-red' },
};

const Header: React.FC<HeaderProps> = ({ status }) => {
  const { text, color } = statusConfig[status];

  return (
    <header className="bg-bg-light p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold text-brand-primary">
        Industrial AI Forecaster
      </h1>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-text-secondary">Status:</span>
        <div className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${color}`}>
            {text}
        </div>
      </div>
    </header>
  );
};

export default Header;
