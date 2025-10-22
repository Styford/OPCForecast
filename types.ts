
export enum ModelType {
  LightGBM = 'LightGBM',
  Prophet = 'Prophet',
  AutoML = 'AutoML',
}

export enum AppStatus {
  Disconnected = 'DISCONNECTED',
  Connecting = 'CONNECTING',
  Training = 'TRAINING',
  Predicting = 'PREDICTING',
  Stopping = 'STOPPING',
  Error = 'ERROR',
}

export enum LogLevel {
  INFO = 'INFO',
  OK = 'OK',
  ERROR = 'ERROR',
  WARN = 'WARN',
}

export interface ConfigState {
  opcServerUrl: string;
  username: string;
  tag: string;
  model: ModelType;
}

export interface LogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface ChartDataPoint {
  time: string;
  value: number | null;
  predicted?: number | null;
}

export interface Metrics {
  currentValue: number | null;
  predictedValue: number | null;
  modelAccuracy: number | null;
  lastUpdate: string | null;
}
