
import React, { useRef, useEffect } from 'react';
import { LogMessage, LogLevel } from '../types';
import { TerminalIcon } from './Icons';

interface StatusLogsProps {
  logs: LogMessage[];
}

const levelStyles: Record<LogLevel, string> = {
    [LogLevel.INFO]: 'text-gray-400',
    [LogLevel.OK]: 'text-accent-green',
    [LogLevel.ERROR]: 'text-accent-red',
    [LogLevel.WARN]: 'text-accent-yellow',
};

const StatusLogs: React.FC<StatusLogsProps> = ({ logs }) => {
    const endOfLogsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
    <div className="bg-bg-light rounded-lg shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-brand-secondary flex items-center">
          <TerminalIcon className="w-6 h-6 mr-2" />
          System Logs
      </h2>
      <div className="flex-grow bg-gray-900 rounded p-4 overflow-y-auto font-mono text-xs text-gray-300">
        {logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 mr-2">{log.timestamp}</span>
            <span className={`font-bold mr-2 ${levelStyles[log.level]}`}>[{log.level}]</span>
            <span>{log.message}</span>
          </div>
        ))}
        <div ref={endOfLogsRef} />
      </div>
    </div>
    );
};

export default StatusLogs;
