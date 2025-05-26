import { Simulation } from "@/repositories/Simulation/ISimulationRepository";
import { createContext } from "react";

export default createContext<
  [Simulation[], (simulations: Simulation[]) => void]
>([[], () => {}]);
