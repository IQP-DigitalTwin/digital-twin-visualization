"use client";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo } from "react";
import { TileLayer, GeoJSON, Pane, useMap } from "react-leaflet";
import { FeatureCollection } from "geojson";
import departements from "../../../public/files/geo/departements.json";
import geojson2h3 from "geojson2h3";
import { GeoJsonProperties } from "geojson";
import { LatLngBoundsExpression, Map } from "leaflet";
import useWeather from "@/hooks/useWeather";
import { weatherRepository } from "@/repositories/Weather/WeatherRepository";

export type Department = {
  name: string;
  code: string;
};

const MapH3 = ({
  suffixKey,
  h3Level = 4,
  layers,
  week,
  targetTemperature,
  meteoOpacity = 0.4,
  climatSensibility,
  temperatureSensibility,
  onSelect,
  onReady,
}: {
  suffixKey?: string | number | null;
  h3Level?: number;
  week?: string | number | null;
  targetTemperature?: number | null;
  climatSensibility: number;
  temperatureSensibility: number;
  meteoOpacity?: number;
  layers: ((h3Index: string) => GeoJsonProperties)[];
  onSelect: (departement: Department, bounds: LatLngBoundsExpression) => void;
  onReady: (map: Map) => void;
}) => {
  const deps = departements as FeatureCollection;
  const h3 = useMemo(() => geojson2h3.featureToH3Set(deps, h3Level), [h3Level]);
  const { colors, opacities, temperatures, stats } = useWeather(
    week,
    targetTemperature,
    temperatureSensibility,
    climatSensibility,
  );
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, []);

  return (
    <>
      <Pane name="tiles">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png" />
      </Pane>
      <Pane name="h3">
        {layers.map((properties, index) => (
          <GeoJSON
            key={`${suffixKey}-${index}-${meteoOpacity}`}
            data={geojson2h3.h3SetToFeatureCollection(h3, properties)}
            style={(pentagon) => {
              return {
                color: pentagon?.properties.color || "#ffffff",
                weight: 0,
                fillOpacity: pentagon?.properties.opacity || 0.1,
              };
            }}
          />
        ))}
      </Pane>
      <Pane name="departments">
        <GeoJSON
          data={deps}
          key={`${suffixKey}-${meteoOpacity}-${stats.week}`}
          style={(dep) => {
            return {
              weight: 0.3,
              fillOpacity: meteoOpacity * opacities[dep?.properties.code],
              color: colors[dep?.properties.code],
            };
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties && feature.properties.nom) {
              layer.bindPopup(
                `${feature.properties.nom} (${feature.properties.code}): ${Math.round(10 * temperatures[feature.properties.code]?.tmoy) /
                10
                }°C - ${weatherRepository.getH3ByDep(feature.properties.code)}`,
                {
                  closeButton: false,
                },
              );
              layer.on("click", function(e) {
                const bounds = e.target.getBounds();
                layer.closePopup();
                onSelect(
                  {
                    name: feature.properties.nom,
                    code: feature.properties.code,
                  },
                  bounds,
                );
              });
              layer.on("mouseover", function() {
                if (map.getZoom() < 8) {
                  layer.openPopup();
                  return;
                }

                layer.closePopup();
              });
              layer.on("mouseout", function() {
                layer.closePopup();
              });
            }
          }}
        />
      </Pane>
    </>
  );
};

export default MapH3;
