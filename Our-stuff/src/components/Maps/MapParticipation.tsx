"use client";
import "leaflet/dist/leaflet.css";
import React, { useState, useCallback } from "react";
import { MapContainer } from "react-leaflet";
import { GiFrance } from "react-icons/gi";
import MapH3, { Department } from "./MapH3";
import { ClientKind } from "@/hooks/useJumoSimulationDataSource";
import { LatLngBoundsExpression, LatLngExpression, Map } from "leaflet";
import Loader from "../common/Loader";
import { createNuances } from "@/utils";
import { TbTemperature } from "react-icons/tb";

const MapParticipation: React.FC<{
  title: string;
  data: Record<string, Record<string, number[]>>;
  clientKind?: ClientKind | null;
  week: number | string | null;
  h3Level?: number;
  location?: Department | null;
  center?: LatLngExpression;
  climatSensibility: number;
  temperatureSensibility: number;
  targetTemperature: number | null;
  onSelectLocation: (
    location: Department,
    bounds: LatLngBoundsExpression,
  ) => void;
  onReset: (map: Map) => void;
  onReady?: (map: Map) => void;
  infoIcon?: React.ReactElement;
}> = ({
  title = null,
  clientKind,
  data,
  week,
  h3Level = 4,
  climatSensibility = 1,
  temperatureSensibility = 1,
  targetTemperature,
  location,
  center = [46.232192999999995, 2.209666999999996] as LatLngExpression,
  onSelectLocation,
  onReset,
  onReady,
  infoIcon,
}) => {
    const [map, setMap] = useState<Map | null>(null);
    const [meteoOpacity] = useState<number>(0.4);
    const [meteoSelected, setMeteoSelected] = useState<boolean>(
      !Boolean(clientKind),
    );

    const useParticipationProperties = (clientKind?: ClientKind | null) => {
      const participationStats = useCallback(
        (clientKind?: ClientKind | null) => {
          if (!clientKind || !data[clientKind]) {
            return null;
          }

          let acc = 0;
          let min = null;
          let max = null;
          let total = 0;

          for (const index in data[clientKind]) {
            const value = data[clientKind][index][0];
            if ((min && value < min) || !min) {
              min = value;
            }

            if ((max && value > max) || !max) {
              max = value;
            }

            for (const clientKind in data) {
              total += data[clientKind][index][0];
            }

            acc += value;
          }

          return {
            min: min,
            max: max,
            total: total,
            average: acc / Object.keys(data[clientKind]).length,
          };
        },
        // eslint-disable-next-line
        [clientKind, location],
      );

      const stats = participationStats(clientKind);
      const getColorValue = createNuances({
        globalInterval: {
          min: stats?.min || 0,
          max: stats?.max || 0,
        },
        color: {
          [ClientKind.NonParticipant]: "red",
          [ClientKind.ActiveParticipant]: "green",
          [ClientKind.PassiveParticipant]: "blue",
        }[clientKind as string],
      });

      return useCallback(
        (h3Index: string) => {
          const opacity = clientKind ? 1 : 0;
          if (!clientKind) {
            return {
              color: "white",
              opacity: 0.1,
            };
          }

          if (!data[clientKind] || !participationStats) {
            return {
              color: `white`,
              opacity: 0.1,
            };
          }

          return {
            color: getColorValue(data[clientKind][h3Index]?.[0]),
            opacity: opacity,
          };
        },
        // eslint-disable-next-line
        [data, participationStats, clientKind, getColorValue, meteoOpacity],
      );
    };

    const onResetMap = (map: Map | null) => {
      if (!map) {
        return;
      }

      onReset(map);
    };

    const onReadyMap = (map: Map) => {
      setMap(map);
      if (onReady && map) {
        onReady(map);
      }
    };

    const onToggleMeteo = () => {
      setMeteoSelected(!meteoSelected);
    };

    return (
      <>
        <div className="flex justify-between">
          <h4 className="mb-2 text-xl font-semibold text-primary dark:text-white">
            {title} -{" "}
            {location ? `${location?.name} (${location?.code})` : "France"}
          </h4>
          <div className="flex print:invisible">
            <div
              onClick={() => onResetMap(map)}
              className={`mr-3 cursor-pointer ${!location ? "text-primary" : "text-grey"} mt-2`}
            >
              <GiFrance />
            </div>
            <div
              onClick={() => onToggleMeteo()}
              className={`mr-3 cursor-pointer ${!location ? "text-primary" : "text-grey"} mt-2`}
            >
              <TbTemperature />
            </div>
            <div className="mt-2 cursor-pointer ">{infoIcon}</div>
          </div>
        </div>
        <div className="h-90">
          <MapContainer
            style={{ height: "100%" }}
            center={center}
            maxBoundsViscosity={1.0}
            zoom={5}
            zoomControl={true}
            scrollWheelZoom={false}
            dragging={true}
            touchZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
            placeholder={<Loader height="full" />}
          >
            <MapH3
              suffixKey={String(clientKind)}
              week={week}
              climatSensibility={climatSensibility}
              temperatureSensibility={temperatureSensibility}
              layers={[useParticipationProperties(clientKind)]}
              onSelect={onSelectLocation}
              targetTemperature={targetTemperature}
              meteoOpacity={
                clientKind ? (meteoSelected ? meteoOpacity : 0) : meteoOpacity
              }
              onReady={onReadyMap}
              h3Level={h3Level}
            />
          </MapContainer>
        </div>
      </>
    );
  };

export default MapParticipation;
