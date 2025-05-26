"use client";

import { ApexOptions } from "apexcharts";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ClientKind } from "@/hooks/useJumoSimulationDataSource";
import { Department } from "../Maps/MapH3";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  labels: [
    "ont anticipé l'usage des appareils",
    "ont modifié l'usages des appareils pendant la réduction",
    "ont anticipé et modifié l'usage des appareils pendant la réduction",
  ],
  legend: {
    position: "bottom",
    horizontalAlign: "left",
  },
  tooltip: {
    enabled: true,
  },
  colors: ["#7ab100", "#93c90e", "#ace234"],
  dataLabels: {
    formatter: (val) => Math.round(Number(val) * 100) / 100 + "%",
  },
};

const ActiveParticipationRepartition: React.FC<{
  aggregatedSeries: { total: number; series: number[] };
  location?: Department | null;
  onSelection: (kind: ClientKind) => void;
  infoIcon?: React.ReactElement;
}> = ({ aggregatedSeries, location, onSelection, infoIcon }) => {
  options.chart = {
    events: {
      dataPointSelection(_, __, config) {
        onSelection(
          [
            ClientKind.ActiveParticipant,
            ClientKind.PassiveParticipant,
            ClientKind.NonParticipant,
          ][config.dataPointIndex],
        );
      },
    },
  };

  return (
    <>
      <div className="flex justify-between">
        <h4 className="mb-2 text-xl font-semibold text-primary dark:text-white">
          Comportement des participant actifs -{" "}
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

export default ActiveParticipationRepartition;
