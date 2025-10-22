
import React, { useState } from 'react';
import { ConfigState, ModelType, AppStatus } from '../types';
import { MODEL_OPTIONS, TAG_OPTIONS } from '../constants';
import { CogIcon } from './Icons';

interface ConfigPanelProps {
  config: ConfigState;
  onConfigChange: (newConfig: ConfigState) => void;
  onConnect: () => void;
  onToggleLoop: () => void;
  status: AppStatus;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange, onConnect, onToggleLoop, status }) => {
  const [password, setPassword] = useState('**********');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onConfigChange({ ...config, [e.target.name]: e.target.value });
  };
  
  const isRunning = status === AppStatus.Predicting || status === AppStatus.Training || status === AppStatus.Connecting;
  const isDisconnected = status === AppStatus.Disconnected || status === AppStatus.Error;

  return (
    <div className="bg-bg-light rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-brand-secondary flex items-center">
        <CogIcon className="w-6 h-6 mr-2" />
        Configuration
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="opcServerUrl" className="block text-sm font-medium text-text-secondary">OPC UA Server URL</label>
          <input
            type="text"
            id="opcServerUrl"
            name="opcServerUrl"
            value={config.opcServerUrl}
            onChange={handleChange}
            disabled={isRunning}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:opacity-50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={config.username}
                    onChange={handleChange}
                    disabled={isRunning}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:opacity-50"
                />
            </div>
            <div>
                <label htmlFor="password" disabled={isRunning} className="block text-sm font-medium text-text-secondary">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isRunning}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:opacity-50"
                />
            </div>
        </div>
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-text-secondary">Target Tag</label>
          <select
            id="tag"
            name="tag"
            value={config.tag}
            onChange={handleChange}
            disabled={isRunning}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:opacity-50"
          >
            {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-text-secondary">Prediction Model</label>
          <select
            id="model"
            name="model"
            value={config.model}
            onChange={handleChange}
            disabled={isRunning}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm disabled:opacity-50"
          >
            {MODEL_OPTIONS.map(model => <option key={model} value={model}>{model}</option>)}
          </select>
        </div>
        <div className="pt-4 flex flex-col space-y-3">
           <button
            type="button"
            onClick={onConnect}
            disabled={!isDisconnected}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Connect & Train Model
          </button>
          <button
            type="button"
            onClick={onToggleLoop}
            disabled={isDisconnected || status === AppStatus.Connecting || status === AppStatus.Training}
            className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${status === AppStatus.Predicting ? 'bg-accent-red hover:bg-red-700' : 'bg-accent-green hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed`}
          >
            {status === AppStatus.Predicting ? 'Stop Prediction Loop' : 'Start Prediction Loop'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigPanel;
