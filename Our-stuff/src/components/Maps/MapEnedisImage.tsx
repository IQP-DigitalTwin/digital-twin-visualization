"use client";
import "leaflet/dist/leaflet.css";
import React, { useState, useCallback } from "react";
import { MapContainer } from "react-leaflet";
import { GiFrance } from "react-icons/gi";
import MapH3, { Department } from "./MapH3";
import { LatLngBoundsExpression, LatLngExpression, Map } from "leaflet";
import Loader from "../common/Loader";

const MapEnedisImage: React.FC<{
  title: string;
  data: Record<string, Record<string, number[]>>;
  week: number | string;
  h3Level?: number;
  location?: Department | null;
  center?: LatLngExpression;
  onSelectLocation: (
    location: Department,
    bounds: LatLngBoundsExpression,
  ) => void;
  onReset: (map: Map) => void;
  onReady?: (map: Map) => void;
  infoIcon?: React.ReactElement;
}> = ({
  title = null,
  data,
  week,
  h3Level = 4,
  location,
  center = [46.232192999999995, 2.209666999999996] as LatLngExpression,
  onSelectLocation,
  onReset,
  onReady,
  infoIcon,
}) => {
  const [map, setMap] = useState<Map | null>(null);
  const enedisImageProperties = useCallback(
    (h3Index: string) => {
      if (!data) {
        return {
          color: `black`,
          opacity: 0.2,
        };
      }

      if (data["Better"][h3Index]?.[1] < data["Worse"][h3Index]?.[1]) {
        return { color: "#fb5454", opacity: 0.2 };
      }
      if (data["Better"][h3Index]?.[1] > data["Worse"][h3Index]?.[1]) {
        return { color: "#93c90e", opacity: 0.2 };
      }
      return {
        color: `white`,
        opacity: 0.2,
      };
    },
    [data],
  );

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
            suffixKey={week}
            layers={[enedisImageProperties]}
            onSelect={onSelectLocation}
            onReady={onReadyMap}
            climatSensibility={1}
            temperatureSensibility={1}
            week={week}
            meteoOpacity={0}
            h3Level={h3Level}
          />
        </MapContainer>
      </div>
    </>
  );
};

export default MapEnedisImage;
