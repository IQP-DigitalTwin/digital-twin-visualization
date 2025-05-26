"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";
import { Department } from "../Maps/MapH3";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  colors: ["#93c90e", "#8aa941", "#7d8a5a", "#6c6c6c"],
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 10,
      borderRadiusApplication: "end", // 'around', 'end'
      borderRadiusWhenStacked: "last", // 'all', 'last'
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontWeight: 900,
          },
          offsetX: 5,
        },
      },
    },
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (value: number) => {
        return value;
      },
    },
  },
  yaxis: {
    type: "category",
    labels: {
      minWidth: 80,
      formatter: (value: number, index: any) => {
        const text = ["Usage anticipé", "Usage modifié", "Les 2"];
        if (
          index &&
          typeof index?.dataPointIndex !== undefined &&
          index?.dataPointIndex !== -1
        ) {
          return text[index.dataPointIndex];
        }

        return value;
      },
    },
  },

  dataLabels: {
    formatter: (val: number) => {
      if (val > 100000) return Math.round(val / 1000) + "k";
      return val;
    },
  },

  xaxis: {
    tickAmount: 4,
  },

  legend: {
    position: "bottom",
    horizontalAlign: "left",
  },
  fill: {
    opacity: 1,
  },
};

const ScheduledBehaviourRepartition: React.FC<{
  aggregatedSeries: { series: ApexAxisChartSeries };
  location?: Department | null;
  infoIcon?: React.ReactElement;
}> = ({ aggregatedSeries, location, infoIcon }) => {
  return (
    <>
      <div className="flex justify-between">
        <h4 className="mb-2 text-xl font-semibold text-primary dark:text-white">
          Report des appareils - {location ? `${location?.name}` : "France"}
        </h4>
        <div className="flex print:invisible">
          <div className="mt-2 cursor-pointer ">{infoIcon}</div>
        </div>
      </div>

      <div>
        <div id="participation-chart" className="mt-5">
          <ReactApexChart
            options={options as unknown as ApexOptions}
            series={aggregatedSeries.series}
            height={350}
            type="bar"
            width={"100%"}
          />
        </div>
      </div>
    </>
  );
};

export default ScheduledBehaviourRepartition;
