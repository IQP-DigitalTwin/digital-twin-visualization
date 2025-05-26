export type Temperatures = {
  tmin: number;
  tmax: number;
  tmoy: number;
};

export type WeatherStats = {
  min?: number;
  max?: number;
  avg?: number;
  week?: string | number | null;
};
export type WeatherRef = {
  department: string;
  week: number;
  day: string;
  temperatures: Temperatures;
};
export type Weather = {
  temperatures: Record<string, Temperatures>;
  ref: WeatherRef;
  stats: WeatherStats;
  colors: Record<string, string>;
  opacities: Record<string, number>;
};
