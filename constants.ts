
import { ConfigState, ModelType } from './types';

export const TAG_OPTIONS: string[] = [
  "Temperature.Sensor1",
  "Pressure.LineA",
  "Flow.Pump3",
  "Vibration.Motor7B",
];

export const MODEL_OPTIONS: ModelType[] = [
  ModelType.LightGBM,
  ModelType.Prophet,
  ModelType.AutoML,
];

export const DEFAULT_CONFIG: ConfigState = {
  opcServerUrl: "opc.tcp://192.168.1.100:4840",
  username: "operator",
  tag: TAG_OPTIONS[0],
  model: ModelType.LightGBM,
};
