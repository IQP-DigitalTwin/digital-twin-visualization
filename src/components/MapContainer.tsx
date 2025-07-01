'use client';

import { useState, useRef, useEffect } from 'react';
import { SimulationAgentRow } from '@/types';
import D3Map, { MapRef } from './D3Map';
import MapToolbar from './MapToolbar';

interface MapContainerProps {
  agentData: SimulationAgentRow[];
}

export default function MapContainer({ agentData }: MapContainerProps) {
  const [mapView, setMapView] = useState<'suppliers' | 'timesSwitched'>('suppliers');
  const mapRef = useRef<MapRef>(null);

  const handleResetZoom = () => {
    if (mapRef.current) {
      mapRef.current.resetZoom();
    }
  };

  useEffect(() => {
    handleResetZoom();
  }, [mapView]);

  return (
    <>
      <MapToolbar onViewChange={setMapView} onResetZoom={handleResetZoom} />
      <div className="aspect-square w-full">
        <D3Map ref={mapRef} data={agentData} view={mapView} />
      </div>
    </>
  );
}
