import SideBarSimulationIcon from "@/components/Sidebar/SideBarSimulationIcon";
import { Simulation } from "@/repositories/Simulation/ISimulationRepository";
import { useEffect, useState, useContext } from "react";
import SimulationsContext from "./contexts/SimulationsContext";

const initialMenuGroups = [
  {
    name: "ACTIONS",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            height="18px"
            viewBox="0 0 50 50"
            width="18px"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect fill="none" height="50" width="50" />
            <line
              fill="none"
              stroke="#FFFFFF"
              strokeMiterlimit="10"
              strokeWidth="4"
              x1="9"
              x2="41"
              y1="25"
              y2="25"
            />
            <line
              fill="none"
              stroke="#FFFFFF"
              strokeMiterlimit="10"
              strokeWidth="4"
              x1="25"
              x2="25"
              y1="9"
              y2="41"
            />
          </svg>
        ),
        label: "Créer une simulation",
        route: "/simulations/create",
      },
    ],
  },
  {
    name: "SIMULATIONS TERMINÉES",
    menuItems: [],
  },
  {
    name: "SIMULATIONS EN COURS",
    menuItems: [],
  },
  {
    name: "SIMULATIONS ÉCHOUÉES",
    menuItems: [],
  },
];

export default function useSimulationMenuItem(): [typeof initialMenuGroups] {
  const [menuGroups, setMenuGroups] = useState(initialMenuGroups);
  const [simulations] = useContext(SimulationsContext);

  useEffect(() => {
    function addSimulationMenuItems(simulations: Simulation[]) {
      const cloneMenuGroups = [...menuGroups];
      const simulationsDone = simulations.filter(
        (simulation) => simulation.status === "Done",
      );
      const simulationsNotDone = simulations.filter(
        (simulation) =>
          simulation.status !== "Done" &&
          simulation.status !== "Failed" &&
          simulation.status !== "Error",
      );
      const simulationsFailed = simulations.filter(
        (simulation) =>
          simulation.status === "Error" || simulation.status === "Failed",
      );

      cloneMenuGroups[1].menuItems = simulationsDone.map((simulation) => ({
        icon: <SideBarSimulationIcon />,
        label: simulation.name,
        route: `/simulations/${simulation.id}`,
      }));

      cloneMenuGroups[2].menuItems = simulationsNotDone.map((simulation) => ({
        icon: <SideBarSimulationIcon />,
        label: simulation.name,
        route: `/simulations/${simulation.id}`,
      }));
      cloneMenuGroups[3].menuItems = simulationsFailed.map((simulation) => ({
        icon: <SideBarSimulationIcon />,
        label: simulation.name,
        route: `/simulations/${simulation.id}`,
      }));
      setMenuGroups(cloneMenuGroups);
    }
    addSimulationMenuItems(simulations);
  }, [simulations]);

  return [menuGroups];
}
