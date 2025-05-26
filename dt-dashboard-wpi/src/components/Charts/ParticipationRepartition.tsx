"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ClientKind } from "@/hooks/useJumoSimulationDataSource";
import { Department } from "../Maps/MapH3";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ParticipationRepartition: React.FC<{
  aggregatedSeries: { total: number; series: number[] };
  location?: Department | null;
  onSelection: (kind: ClientKind) => void;
  infoIcon?: React.ReactElement;
}> = ({ aggregatedSeries, location, onSelection, infoIcon }) => {
  const options: ApexOptions = {
    labels: ["Participants Actifs", "Participants Passifs", "Non Participants"],
    colors: ["#93C90E", "#1423dc", "#FB5454"],
    legend: {
      position: "bottom",
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => {
          return String(Math.round(value));
        },
      },
    },
    dataLabels: {
      formatter: (val) => Math.round(Number(val) * 100) / 100 + "%",
    },
    chart: {
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
    },
  };

  console.log(aggregatedSeries);

  return (
    <>
      <div className="flex justify-between">
        <h4 className="mb-2 text-xl font-semibold text-primary dark:text-white">
          Participation - {location ? `${location?.name}` : "France"}
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

export default ParticipationRepartition;
