import { useState } from "react";
import { getSimulations } from "./dataSources/api";
import { Simulation } from "@/repositories/Simulation/ISimulationRepository";

export default function useSimulations(): [
  Simulation[],
  {
    setSimulations(simulations: Simulation[]): void;
    fetchSimulations(): Promise<void>;
    startSimulationsUpdateLoop(): number;
    stopSimulationsUpdateLoop(timeoutId: number): void;
  },
] {
  const [simulations, setSimulations] = useState<Simulation[]>([]);

  async function fetchSimulations() {
    const simulations = await getSimulations();
    setSimulations(simulations);
  }

  function startSimulationsUpdateLoop(): number {
    const timeoutId = window.setInterval(() => {
      getSimulations().then((simulations) => {
        setSimulations(simulations);
      });
    }, 5000);

    return timeoutId;
  }

  function stopSimulationsUpdateLoop(timeoutId: number): void {
    clearTimeout(timeoutId);
  }
  return [
    simulations,
    {
      setSimulations,
      fetchSimulations,
      startSimulationsUpdateLoop,
      stopSimulationsUpdateLoop,
    },
  ];
}
