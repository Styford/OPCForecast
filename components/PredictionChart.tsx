
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface PredictionChartProps {
  data: ChartDataPoint[];
  tag: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ data, tag }) => {
  return (
    <div className="bg-bg-light rounded-lg shadow-lg p-6 h-96">
      <h3 className="text-lg font-semibold mb-4">{`Live Data & 1-Hour Forecast for ${tag}`}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="time" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
          <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']}/>
          <Tooltip
            contentStyle={{
              backgroundColor: '#2d3748',
              borderColor: '#4A5568',
            }}
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}} />
          <Line
            type="monotone"
            dataKey="value"
            name="Actual Value"
            stroke="#00A8E8"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted Value"
            stroke="#F6E05E"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
