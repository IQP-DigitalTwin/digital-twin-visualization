import { Temperatures, WeatherRef } from "@/types/Weather";
import temperaturesDataSource from "../../../public/files/weather/average-temperatures-2023-by-department-and-week.json";
import climatsDataSource from "../../../public/files/geo/climatic-area-by-department.json";

import { getRefWeather } from "@/utils/env";

const h3List = [
  "h1a",
  "h1a",
  "h1b",
  "h1b",
  "h1c",
  "h2a",
  "h2b",
  "h2c",
  "h2d",
  "h3",
].reverse();

class WeatherRepository<
  T extends Record<string, Temperatures[]>,
  K extends Record<string, string>,
> {
  private temperaturesDataSource: T;
  private climatsDataSource: K;
  private simulationReference: WeatherRef; // This is the reference date of the simulation. The experimentation was done the Febrary, 15 2023

  constructor(temperatureDataSource: T, climatsDataSource: K) {
    this.temperaturesDataSource = temperatureDataSource;
    this.climatsDataSource = climatsDataSource;
    const ref = getRefWeather();
    this.simulationReference = {
      ...ref,
    };
  }

  findAll(): T {
    return this.temperaturesDataSource;
  }

  findByDep(dep: string): Temperatures[] {
    return this.temperaturesDataSource[dep as keyof T];
  }

  find({
    department,
    week,
  }: {
    department: string;
    week: string | number;
  }): Temperatures {
    const dep = department as keyof typeof temperaturesDataSource;
    const weekNumber = Number(week as keyof typeof dep);
    return this.temperaturesDataSource[dep][weekNumber - 1];
  }

  // tmin : 4.3, tmax : 19.3, tmoy : 12.82
  getRef(): WeatherRef {
    return this.simulationReference;
  }

  getH3() {
    return h3List;
  }

  getH3ByDep(dep: string): string {
    return this.climatsDataSource[dep];
  }
}

export const weatherRepository = new WeatherRepository<
  typeof temperaturesDataSource,
  typeof climatsDataSource
>(temperaturesDataSource, climatsDataSource);
