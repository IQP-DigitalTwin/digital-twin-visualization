"use clien#373d3ft";

import { ApexOptions } from "apexcharts";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Department } from "../Maps/MapH3";
import h3ByDepartements from "../../../public/files/geo/h3-by-department.json";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  labels: ["Meilleure", "Inchangée", "Moins bonne"],
  colors: ["#93C90E", "#1423dc", "#FB5454"],
  legend: {
    position: "bottom",
  },
  tooltip: {
    enabled: true,
  },
  dataLabels: {
    formatter: (val) => Math.round(Number(val) * 100) / 100 + "%",
  },
};

const EnedisImageRepartition: React.FC<{
  aggregatedSeries: { total: number; series: number[] };
  location?: Department | null;
  infoIcon?: React.ReactElement;
}> = ({ aggregatedSeries, location, infoIcon }) => {
  return (
    <>
      <div className="flex justify-between">
        <h4 className="mb-2 text-xl font-semibold text-primary dark:text-white">
          {"Répartition de l'image d'Enedis - "}
          {location ? `${location?.name}` : "France"}
        </h4>
        <div className="flex print:invisible">
          <div className="mt-2 cursor-pointer ">{infoIcon}</div>
        </div>
      </div>

      <div>
        <div id="participation-chart" className="ml-5 mt-10">
          <ReactApexChart
            options={options}
            series={aggregatedSeries.series}
            type="pie"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </>
  );
};

export default EnedisImageRepartition;
