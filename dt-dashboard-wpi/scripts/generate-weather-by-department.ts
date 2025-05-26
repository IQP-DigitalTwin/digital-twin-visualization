import moment from "moment";
import path from "path";
import * as fs from "fs";
import temperatureByDay from "../public/files/weather/temperature-quotidienne-departementale.json";
import _ from "lodash";

const resultPath = path.join(
  __dirname,
  "../public/files/weather/average-temperatures-2023-by-department-and-week.json",
);

const tempsByDay = temperatureByDay as TempByDay[];

type TempByDay = {
  date_obs: string;
  code_insee_departement: string;
  departement: string;
  tmin: number;
  tmax: number;
  tmoy: number;
};

let tempsByDayIn2023 = tempsByDay
  .filter((item: TempByDay) => item.date_obs.startsWith("2023"))
  .map((item) => {
    return {
      ...item,
      weekNumber: moment(item.date_obs).isoWeek(),
    };
  });

let tempsByDayIn2023GroupByDep = _.groupBy(
  tempsByDayIn2023,
  (i) => i.code_insee_departement,
);

let result: Record<string, { tmin: number; tmax: number; tmoy: number }[]> = {};

for (let dep in tempsByDayIn2023GroupByDep) {
  const a = _.groupBy(tempsByDayIn2023GroupByDep[dep], (i) => i.weekNumber);
  for (let b in a) {
    if (!result[dep]) {
      result[dep] = [];
    }

    const tmin = _.minBy(a[b], "tmin")?.tmin;
    const tmax = _.maxBy(a[b], "tmax")?.tmax;

    if (typeof tmin !== "number" || typeof tmax !== "number") {
      throw Error("Missing tmin or tmax");
    }

    result[dep][Number(b) - 1] = {
      tmin,
      tmoy: _.meanBy(a[b], (i) => i.tmoy),
      tmax,
    };
  }
}

result["20"] = result["2A"].map((value, index) => {
  return {
    tmin: _.min([result["2B"][index].tmin, value.tmin]) || 0,
    tmoy: (result["2B"][index].tmoy + value.tmoy) / 2,
    tmax: _.max([result["2B"][index].tmin, value.tmax]) || 0,
  };
});

fs.writeFile(resultPath, JSON.stringify(result, null, 2), (err) => {
  if (err) throw err;
  console.log("Data written to file : ", resultPath);
});
