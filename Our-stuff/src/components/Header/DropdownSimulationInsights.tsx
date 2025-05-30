import { useState, useMemo, useContext } from "react";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";
import SimulationsContext from "@/hooks/contexts/SimulationsContext";

import { CiSettings, CiTrash } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { deleteSimulation } from "@/hooks/dataSources/api";
import { msToTime } from "@/utils";
import { CiImport } from "react-icons/ci";
import { AiOutlinePrinter } from "react-icons/ai";

const DropdownSimulationsInsights = ({
  simId,
}: {
  simId?: string | undefined;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [simulations, setSimulations] = useContext(SimulationsContext);
  const currentSimulation = useMemo(
    () => simulations.find((s) => s.id === simId),
    [simulations, simId],
  );

  const router = useRouter();

  const executionTime = useMemo(() => {
    if (!currentSimulation) {
      return "";
    }

    return msToTime(
      new Date(currentSimulation?.updatedAt).getTime() -
      new Date(currentSimulation?.createdAt).getTime(),
    );
  }, [currentSimulation]);

  if (!currentSimulation) {
    return;
  }

  const handleRemove = async () => {
    if (!simId) {
      return;
    }
    const wantToDeleteConfirmation = confirm(
      "Êtes-vous certain de vouloir supprimer cette simulation ?",
    );
    if (wantToDeleteConfirmation) {
      await deleteSimulation(simId);
      setSimulations(simulations.filter((s) => s.id !== simId));
      router.push("/");
    }
    return;
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="print:invisible">
        <Link
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
          href="#"
          className={`${dropdownOpen ? "bg-primary text-white" : "bg-white text-primary"} relative flex h-12.5 w-12.5 items-center justify-center rounded-full border-[1px] border-primary  text-xl  dark:border-strokedark dark:bg-meta-4 dark:text-white`}
        >
          <CiSettings size={30} />
        </Link>

        {dropdownOpen && (
          <div
            className={` absolute -right-27 mt-2.5 flex w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-100`}
          >
            <div className="flex justify-between px-4.5 py-3">
              <h5 className="text-md font-bold text-primary">
                Information sur la simulation
              </h5>
              <h5 className="cursor-pointer border-red" onClick={handleRemove}>
                <CiTrash size={20} color="red" />
              </h5>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm">
                  <span className="text-black">
                    Nom:{" "}
                    <span className="font-bold">{currentSimulation?.name}</span>
                  </span>
                </p>
              </li>
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm">
                  <span className="text-black">
                    Id:{" "}
                    <span className="font-bold">{currentSimulation?.id}</span>
                  </span>
                </p>
              </li>
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm">
                  <span className="text-black">
                    Status:{" "}
                    <span className="font-bold">
                      {currentSimulation?.status}
                    </span>
                  </span>
                </p>
              </li>
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm font-medium text-bodydark2">
                  <span>Propriétés:</span>
                </p>
                <p className="indent-4 text-sm">
                  <span className="text-black">
                    Population cible:{" "}
                    <span className="font-bold">
                      {currentSimulation?.properties.final_population_number}
                    </span>
                  </span>
                </p>
                <p className="indent-4 text-sm">
                  <span className="text-black">
                    Mode:{" "}
                    <span className="font-bold">
                      {Number(currentSimulation?.properties.mode) + 1}
                    </span>
                  </span>{" "}
                </p>
                {currentSimulation.properties.mode === 0 ? (
                  <p className="indent-4 text-sm">
                    <span className="text-black">
                      Semaine de la coupure:{" "}
                      <span className="font-bold">
                        {currentSimulation?.properties.cut_week_number}
                      </span>
                    </span>{" "}
                  </p>
                ) : (
                  <p className="indent-4 text-sm">
                    <span className="text-black">
                      Temperature moyenne cible:{" "}
                      <span className="font-bold">
                        {currentSimulation?.properties.temperature_target}
                      </span>
                    </span>{" "}
                  </p>
                )}
                <p className="indent-4 text-sm">
                  <span className="text-black">
                    Sensibilité au climat:{" "}
                    <span className="font-bold">
                      {currentSimulation?.properties.climat_sensibility}
                    </span>
                  </span>
                </p>
                <p className="indent-4 text-sm">
                  <span className="text-black">
                    Sensibilité à la temperature:{" "}
                    <span className="font-bold">
                      {currentSimulation?.properties.temperature_sensibility}
                    </span>
                  </span>
                </p>
                <p className="indent-4 text-sm">
                  <span className="text-black">
                    Seed:{" "}
                    <span className="font-bold">
                      {currentSimulation?.properties.seed}
                    </span>
                  </span>
                </p>
              </li>
              <Link
                target="_blank"
                href={`/files/populations/${currentSimulation.initial_population.file}`}
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              >
                <p className="text-sm">
                  <span className="text-black">
                    Population initiale:{" "}
                    <span className="font-bold">
                      {currentSimulation.initial_population.file}
                    </span>
                  </span>
                </p>
              </Link>
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm">
                  <span className="text-black">
                    Temps d&apos;exécution:{" "}
                    <span className="font-bold">{executionTime}</span>
                  </span>
                </p>
              </li>
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm">
                  <span className="text-black">
                    Crée le:{" "}
                    <span className="font-bold">
                      {new Date(currentSimulation?.createdAt).toLocaleString()}
                    </span>
                  </span>
                </p>
              </li>
              <li className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                <p className="text-sm">
                  <span className="text-black">
                    Mise à jour:{" "}
                    <span className="font-bold">
                      {new Date(currentSimulation?.updatedAt).toLocaleString()}
                    </span>
                  </span>
                </p>
              </li>
              {currentSimulation.status === "Done" ? (
                <li className="flex justify-center">
                  <Link
                    className="mx-1 flex justify-center bg-primary px-6 py-2 font-medium text-gray hover:bg-primary-hover"
                    href={`/api/simulations/${simId}.h5`}
                    download={currentSimulation.name + ".h5"}
                    target="_blank"
                  >
                    <CiImport size={20} style={{ marginRight: "5px" }} />
                    Télécharger .h5
                  </Link>
                  <Link
                    className="mx-1 flex justify-center bg-primary px-6 py-2 font-medium text-gray hover:bg-primary-hover"
                    href={`/api/simulations/${simId}.csv`}
                    target="_blank"
                  >
                    <CiImport size={20} style={{ marginRight: "5px" }} />
                    Télécharger .csv
                  </Link>
                </li>
              ) : null}
              {currentSimulation.status === "Done" ? (
                <li>
                  <Link
                    className="mx-2 mb-2 mt-2 flex justify-center bg-primary px-6 py-2 font-medium text-gray hover:bg-primary-hover"
                    href=""
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      print();
                    }}
                  >
                    <AiOutlinePrinter
                      size={20}
                      style={{ marginRight: "10px" }}
                    />
                    Imprimer
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownSimulationsInsights;
