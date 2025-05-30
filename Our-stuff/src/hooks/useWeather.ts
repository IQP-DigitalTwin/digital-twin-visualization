import { useEffect, useMemo, useState } from "react";
import { createNuances } from "@/utils";
import { Temperatures, WeatherStats, Weather } from "@/types/Weather";
import { weatherRepository } from "@/repositories/Weather/WeatherRepository";

const datasource = weatherRepository.findAll();
const ref = weatherRepository.getRef();

export default function useWeather(
  week?: number | string | null,
  targetTemperature?: number | null,
  temperatureSensibility: number = 1,
  climatSensibility: number = 1,
): Weather {
  const weekNumber = Number(week);

  const [result, setResult] = useState<Record<string, Temperatures>>({});
  const [stats, setStats] = useState<WeatherStats>({
    min: undefined,
    max: undefined,
    week: undefined,
  });

  useEffect(() => {
    if (targetTemperature && !week) {
      let min = ref.temperatures.tmoy - 15;
      let max = ref.temperatures.tmoy + 15;
      const data: typeof result = {};
      for (const i in datasource) {
        const dep = i as keyof typeof datasource;
        data[dep] = {
          tmin: targetTemperature,
          tmax: targetTemperature,
          tmoy: targetTemperature,
        };
      }

      setResult(data);
      setStats({
        min: min,
        max: max,
        avg: targetTemperature,
        week,
      });
    }
  }, [week, targetTemperature]);

  useEffect(() => {
    if (week && !targetTemperature) {
      const result: Record<string, Temperatures> = {};
      let min;
      let max;
      let tmoySum = 0;

      for (const i in datasource) {
        const dep = i as keyof typeof datasource;
        const w = Number(weekNumber as keyof typeof dep);
        result[dep] = datasource[dep][w - 1];
        if (!result[dep]) {
          continue;
        }

        if (!min || result[dep].tmoy < min) {
          min = result[dep].tmoy;
        }

        if (!max || result[dep].tmoy > max) {
          max = result[dep].tmoy;
        }

        tmoySum += result[dep].tmoy;
      }

      setResult(result);
      setStats({
        min,
        max,
        avg: tmoySum / Object.keys(datasource).length,
        week,
      });
    }
  }, [week, weekNumber, targetTemperature]);

  const colors = useMemo(() => {
    const [min, max] = [stats?.min || 0, stats?.max || 0];
    const getColorValue = createNuances({
      globalInterval: {
        min: temperatureSensibility
          ? min - ((max - min) * (1 / temperatureSensibility - 1)) / 2
          : 0,
        max: temperatureSensibility
          ? max + ((max - min) * (1 / temperatureSensibility - 1)) / 2
          : 0,
      },
      color: "meteo",
    });
    const colors: Record<string, string> = {};
    for (const dep in result) {
      if (!result[dep]) {
        continue;
      }
      colors[dep] = getColorValue(result[dep].tmoy);
    }

    return colors;
  }, [result, stats, temperatureSensibility]);

  const opacities = useMemo(() => {
    const opacities: Record<string, number> = {};
    const h3List = weatherRepository.getH3();

    for (const dep in result) {
      if (!result[dep]) {
        continue;
      }

      const climatOpacity =
        h3List.findIndex(
          (value) => value === weatherRepository.getH3ByDep(dep),
        ) / h3List.length;

      if (climatSensibility + temperatureSensibility === 0) {
        opacities[dep] = 1;
        continue;
      }

      opacities[dep] =
        temperatureSensibility / (climatSensibility + temperatureSensibility) +
        (climatSensibility * climatOpacity) /
        (climatSensibility + temperatureSensibility);
    }

    return opacities;
  }, [result, climatSensibility, temperatureSensibility]);

  return {
    temperatures: result,
    ref,
    stats,
    colors,
    opacities,
  };
}
