'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SimulationStatusPollerProps {
  simulationId: string;
}

const SimulationStatusPoller: React.FC<SimulationStatusPollerProps> = ({ simulationId }) => {
  const router = useRouter();
  const [status, setStatus] = useState('Created');

  useEffect(() => {
    if (status === 'Done') {
      router.refresh();
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/simulations/${simulationId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'Done') {
            setStatus('Done');
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error polling simulation status:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [status, simulationId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-2xl font-semibold mb-4">Simulation is running...</div>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-400">The page will automatically refresh when the simulation is complete.</p>
    </div>
  );
};

export default SimulationStatusPoller;
