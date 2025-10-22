
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AreaChart, BarChart3, Thermometer, Gauge } from 'lucide-react';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import StatusLogs from './components/StatusLogs';
import PredictionChart from './components/PredictionChart';
import MetricCard from './components/MetricCard';
import { AppStatus, ConfigState, LogLevel, LogMessage, ChartDataPoint, Metrics, ModelType } from './types';
import { DEFAULT_CONFIG } from './constants';

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<AppStatus>(AppStatus.Disconnected);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    currentValue: null,
    predictedValue: null,
    modelAccuracy: null,
    lastUpdate: null
  });

  const predictionIntervalRef = useRef<number | null>(null);
  const dataCounterRef = useRef<number>(0);

  const addLog = useCallback((message: string, level: LogLevel = LogLevel.INFO) => {
    const newLog: LogMessage = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };
    setLogs(prevLogs => [...prevLogs.slice(-200), newLog]);
  }, []);

  const generateInitialData = useCallback(() => {
    const data: ChartDataPoint[] = [];
    const now = Date.now();
    for (let i = 60; i > 0; i--) {
        const time = now - i * 10 * 1000;
        data.push({
            time: new Date(time).toLocaleTimeString(),
            value: 50 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 5,
            predicted: null,
        });
    }
    dataCounterRef.current = 0;
    return data;
  }, []);

  const handleConnectAndTrain = useCallback(() => {
    setStatus(AppStatus.Connecting);
    addLog(`Attempting to connect to OPC UA server at ${config.opcServerUrl}...`);

    setTimeout(() => {
      addLog('Connection successful.', LogLevel.OK);
      addLog('Fetching historical data for training...');
      setStatus(AppStatus.Training);
      setChartData(generateInitialData());

      setTimeout(() => {
        const accuracy = (Math.random() * (0.05 - 0.01) + 0.01).toFixed(4);
        addLog(`Model training complete. Algorithm: ${config.model}. Final MSE: ${accuracy}`, LogLevel.OK);
        setMetrics(prev => ({...prev, modelAccuracy: parseFloat(accuracy)}));
        setStatus(AppStatus.Disconnected); // Ready to start predicting
        addLog('Ready to start prediction loop.', LogLevel.INFO);
      }, 3000);
    }, 1500);
  }, [addLog, config.opcServerUrl, config.model, generateInitialData]);

  const runPrediction = useCallback(() => {
    setChartData(prevData => {
        const newData = [...prevData];
        const lastActualPoint = [...newData].reverse().find(p => p.value !== null);
        if (!lastActualPoint || lastActualPoint.value === null) return newData;
        
        // Add new live data point
        const newValue = 50 + Math.sin(dataCounterRef.current * 0.5) * 20 + (Math.random() - 0.5) * 5;
        const newPoint: ChartDataPoint = {
            time: new Date().toLocaleTimeString(),
            value: newValue,
            predicted: null
        };

        // Remove old data and add new
        const updatedData = [...newData.slice(1), newPoint];

        // Generate new prediction
        let lastVal = newValue;
        const prediction = [];
        for (let i = 1; i <= 6; i++) { // Predict 1 hour (6 * 10 min)
            lastVal += (Math.random() - 0.48) * 2;
            prediction.push({
                time: new Date(Date.now() + i * 10 * 1000).toLocaleTimeString(),
                predicted: lastVal,
                value: null
            });
        }
        
        const finalData = [...updatedData];
        prediction.forEach((p, i) => {
            if (finalData.length + i < 67) {
                finalData.push(p);
            }
        });
        
        setMetrics(prev => ({
            ...prev,
            currentValue: parseFloat(newValue.toFixed(2)),
            predictedValue: parseFloat((prediction[prediction.length - 1].predicted ?? 0).toFixed(2)),
            lastUpdate: new Date().toLocaleTimeString()
        }));

        dataCounterRef.current++;
        return finalData.slice(-67); // Keep a fixed window of actual + predicted
    });
    addLog(`Prediction updated for ${config.tag}. Result written to Predicted.${config.tag}`, LogLevel.INFO);
  }, [addLog, config.tag]);


  const handleTogglePredictionLoop = useCallback(() => {
    if (status === AppStatus.Predicting) {
        setStatus(AppStatus.Stopping);
        addLog('Stopping prediction loop...', LogLevel.WARN);
        if (predictionIntervalRef.current) {
            clearInterval(predictionIntervalRef.current);
            predictionIntervalRef.current = null;
        }
        setTimeout(() => {
            setStatus(AppStatus.Disconnected);
            addLog('Prediction loop stopped.', LogLevel.INFO);
        }, 1000);
    } else {
        setStatus(AppStatus.Predicting);
        addLog('Starting prediction loop (1 update every 10 seconds for demo)...', LogLevel.INFO);
        runPrediction();
        predictionIntervalRef.current = window.setInterval(runPrediction, 10000);
    }
  }, [status, addLog, runPrediction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark font-sans">
      <Header status={status} />
      <main className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1 flex flex-col gap-4 lg:gap-6">
          <ConfigPanel
            config={config}
            onConfigChange={setConfig}
            onConnect={handleConnectAndTrain}
            onToggleLoop={handleTogglePredictionLoop}
            status={status}
          />
          <StatusLogs logs={logs} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
             <MetricCard title="Current Value" value={metrics.currentValue?.toFixed(2) ?? '---'} unit="°C" icon={<Thermometer className="w-6 h-6" />} />
            <MetricCard title="1-Hour Forecast" value={metrics.predictedValue?.toFixed(2) ?? '---'} unit="°C" icon={<AreaChart className="w-6 h-6" />} />
            <MetricCard title="Model MSE" value={metrics.modelAccuracy ?? '---'} icon={<BarChart3 className="w-6 h-6" />} />
            <MetricCard title="Last Update" value={metrics.lastUpdate ?? '---'} icon={<Gauge className="w-6 h-6" />} />
          </div>
          <PredictionChart data={chartData} tag={config.tag} />
        </div>
      </main>
    </div>
  );
};

export default App;
