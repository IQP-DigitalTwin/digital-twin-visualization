"use client";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { MapContainer } from "react-leaflet";
import MapH3, { Department } from "./MapH3";
import { LatLngBoundsExpression, LatLngExpression, Map } from "leaflet";
import Loader from "../common/Loader";

const MapWeather: React.FC<{
  week?: number | string | null;
  targetTemperature?: number | null;
  temperatureSensibility: number;
  climatSensibility: number;
  h3Level?: number;
  location?: Department | null;
  center?: LatLngExpression;
  onSelectLocation: (
    location: Department,
    bounds: LatLngBoundsExpression,
  ) => void;
  onReady?: (map: Map) => void;
}> = ({
  week,
  targetTemperature,
  climatSensibility,
  temperatureSensibility,
  h3Level = 4,
  center = [46.232192999999995, 2.209666999999996] as LatLngExpression,
  onSelectLocation,
  onReady,
}) => {
    const [_, setMap] = useState<Map | null>(null);

    const onReadyMap = (map: Map) => {
      setMap(map);
      if (onReady && map) {
        onReady(map);
      }
    };

    return (
      <>
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
              suffixKey={`${week}-${targetTemperature}-${climatSensibility}-${temperatureSensibility}`}
              layers={[]}
              climatSensibility={climatSensibility}
              temperatureSensibility={temperatureSensibility}
              onSelect={onSelectLocation}
              meteoOpacity={0.6}
              onReady={onReadyMap}
              week={week}
              targetTemperature={targetTemperature}
              h3Level={h3Level}
            />
          </MapContainer>
        </div>
      </>
    );
  };

export default MapWeather;
