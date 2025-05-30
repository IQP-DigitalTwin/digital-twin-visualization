"use client";

import dynamic from "next/dynamic";
import WeekPicker from "@/components/FormElements/DatePicker/WeekPicker";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RangeSlider from "@/components/RangeSlider";
import {
  addPopulationFile,
  createSimulation,
  getPopulationFiles,
} from "@/hooks/dataSources/api";
import React, { useMemo, useEffect, useRef, useState } from "react";
import { simulationSchema } from "@/repositories/Simulation/ISimulationRepository";
import { getZodDefaultValues } from "@/utils";
import { useRouter } from "next/navigation";
import { Accordion } from "@szhsin/react-accordion";
import { CustomAccordionItem } from "@/components/Accordion/CustomAccordionItem";
import useWeather from "@/hooks/useWeather";
import { Modal } from "@/components/Modal";
import { FaInfoCircle } from "react-icons/fa";
import { ClimatExplanations } from "@/components/Explanations/ClimatExplanations";
import { TemperatureExplanations } from "@/components/Explanations/Temperatures";
const initialModalState = {
  "0": false,
  "1": false,
  "2": false,
  "3": false,
  "4": false,
  "5": false,
  "6": false,
  "7": false,
};

const MapWeather = dynamic(() => import("@/components/Maps/MapWeather"), {
  ssr: false,
});

export default function CreateSimulation() {
  const router = useRouter();

  const [simulation, setSimulation] = useState(
    getZodDefaultValues(simulationSchema),
  );

  const {
    mode,
    cut_week_number,
    temperature_target,
    climat_sensibility,
    temperature_sensibility,
  } = simulation.properties;
  const [populationFiles, setPopulationFiles] = useState<string[]>([]);
  const [creating, setCreating] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const populationFileInput = useRef<HTMLInputElement>(null);
  const [newFileName, setFileName] = useState<string | null>(null);
  const [modalState, setModalState] =
    useState<Record<string, boolean>>(initialModalState);

  useEffect(() => {
    getPopulationFiles().then((files) => {
      setPopulationFiles(files);
      setSimulation({
        ...simulation,
        initial_population: {
          ...simulation.initial_population,
          file: files[0],
        },
      });
    });
  }, []);

  const onOpenModal = (modalName: string) => {
    setModalState({
      ...initialModalState,
      [modalName]: true,
    });
  };

  const onCloseModal = (modalName: string) => {
    setModalState({
      ...initialModalState,
      [modalName]: false,
    });
  };

  const properties = useMemo(
    () => [
      {
        week: cut_week_number,
        targetTemperature: null,
        climatSensibility: climat_sensibility,
        temperatureSensibility: temperature_sensibility,
      },
      {
        week: null,
        targetTemperature: temperature_target,
        climatSensibility: climat_sensibility,
        temperatureSensibility: temperature_sensibility,
      },
    ],
    [
      cut_week_number,
      temperature_target,
      climat_sensibility,
      temperature_sensibility,
    ],
  );

  const { stats, ref } = useWeather(
    properties[mode].week,
    properties[mode].targetTemperature,
    properties[mode].temperatureSensibility,
    properties[mode].climatSensibility,
  );

  const weatherMap = useMemo(() => {
    return <MapWeather {...properties[mode]} onSelectLocation={() => { }} />;
  }, [properties, mode]);

  const handleSimulationCreation = async () => {
    setCreating(true);
    const newSim = await createSimulation(simulation);
    router.push("/simulations/" + newSim.id);
  };

  const handleSubmitPopulation = async () => {
    const file = populationFileInput?.current?.files?.[0];
    if (file) {
      setUploading(true);
      await addPopulationFile(file);
      setPopulationFiles(await getPopulationFiles());
      setSimulation({
        ...simulation,
        initial_population: {
          ...simulation.initial_population,
          file: file.name,
        },
      });
      setFileName(null);
      setUploading(false);
    }
  };

  const handleNewPopulationFile = () => {
    const file = populationFileInput?.current?.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSelectMode = (value: number) => {
    if (value !== simulation.properties.mode) {
      setSimulation({
        ...simulation,
        properties: {
          ...simulation.properties,
          mode: value,
        },
      });
    }
  };

  return (
    <DefaultLayout title="Créer une nouvelle simulation">
      {creating ? (
        <div className="flex items-center justify-center pt-[100px] dark:bg-black">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="mx-auto max-w-270">
          <Modal isOpen={modalState["0"]} onClose={() => onCloseModal("0")}>
            <h1 className="mb-5 text-lg font-bold">
              Taille de la population cible
            </h1>
            <p className="mb-5">
              La taille de la population cible détermine l'objectif d'agent à
              atteindre pour la simulation. Plus la taille sera grande, plus la
              simulation prendra du temps.
            </p>
            <p className="mb-5">
              La population est représenté par les foyers et non les individus.
              En france nous comptons environ 26 millions de foyers
            </p>
            <p className="mb-5">
              Un conseil: pour faire une simulation rapidement, utilisez une
              valeur de l'ordre 26000 ou 260000 foyers. Les grandeurs et les
              proportions seront respéctées avec une simulation à la grandeur de
              la France.
            </p>
          </Modal>
          <Modal isOpen={modalState["1"]} onClose={() => onCloseModal("1")}>
            <h1 className="mb-5 text-lg font-bold">Le MODE 1</h1>
            <p className="mb-5">
              Dans ce mode, vous pouvez reproduire les conditions de température
              de la semaine cible en 2023 en le champs "Semaine de limitation".
              Les agents seront sensibles à la température du département à
              cette date et à la zone climatique.
            </p>
            <TemperatureExplanations info />
            <ClimatExplanations info />
          </Modal>
          <Modal isOpen={modalState["2"]} onClose={() => onCloseModal("2")}>
            <h1 className="mb-5 text-lg font-bold">Le MODE 2</h1>
            <p className="mb-5">
              Dans ce mode, vous pouvez imposer une température identique à
              toute à la France à l'aide du champs "Température moyenne cible".
              Vous pouvez ainsi analyser le comportement d'un département (ou
              une zone climatique) bien déterminé à une température T ou
              comparer les différences de comportement entre chaque région.
              <br />
              <br />
              La température moyenne initial de{" "}
              <span className="font-bold">12.8°C</span> est la température de
              l'expérimentation. Faite varier le curseur pour changer la
              température.
            </p>
            <TemperatureExplanations info />
            <ClimatExplanations info />
          </Modal>
          <Modal isOpen={modalState["3"]} onClose={() => onCloseModal("3")}>
            <h1 className="mb-5 text-lg font-bold">
              La sensibilité à la zone climatique
            </h1>
            <p className="mb-5">
              En faisant varier la sensibilité à la zone climatique vous
              augmentez ou diminuez la probabilité de la population à participer
              en fonction de la région où il habite
            </p>
            <p className="mb-5 italic">
              Exemple: si il vit dans une zone climatique plus froide, il aura
              tendance à moins accepter que la normal (1) si la sensibilité est
              plus grande que 1
            </p>
            <p className="mb-5">
              Si la sensibilité est à 0, la température n'aura plus d'importance
              sur le résultat
            </p>
            <ClimatExplanations info />
          </Modal>
          <Modal isOpen={modalState["4"]} onClose={() => onCloseModal("4")}>
            <h1 className="mb-5 text-lg font-bold">
              La sensibilité aux températures
            </h1>
            <p className="mb-5">
              En faisant varier la sensibilité aux températures vous augmentez
              ou diminuez la probabilité de la population à participer en
              fonction de la température dans sa région
            </p>
            <p className="mb-5 italic">
              Exemple: si la température est plus chaude, il aura tendance à
              plus accepter que la normale (1) si la sensibilité est supérieur 1
            </p>
            <p className="mb-5">
              Si la sensibilité est à 0, la zone climatique n'aura plus
              d'importance sur le résultat
            </p>
            <TemperatureExplanations info />
          </Modal>
          <Modal isOpen={modalState["5"]} onClose={() => onCloseModal("5")}>
            <h1 className="mb-5 text-lg font-bold">Choix du seed</h1>
            <p className="mb-5">
              Pour deux simulations avec le même seed, la population aura
              exactement les mêmes probabilités d'action aléatoire. Pour rejouer
              exactement la même simulation, vous pouvez concerver le même seed
              entre chaque lancement.
            </p>
          </Modal>
          <Modal isOpen={modalState["6"]} onClose={() => onCloseModal("6")}>
            <TemperatureExplanations />
            <ClimatExplanations />
          </Modal>
          <Modal isOpen={modalState["7"]} onClose={() => onCloseModal("7")}>
            <h1 className="mb-5 text-lg font-bold">La population initiale</h1>
            <p className="mb-5">
              La population initiale correspond aux données des agents récupérés
              initialement lors de l'expérimentation avec leurs poids
              d'importances et les probabilités d'accéptations.
            </p>
          </Modal>
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 xl:col-span-3">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Information sur la simulation
                  </h3>
                </div>

                <div className="pb-7 pl-7 pr-7 pt-1">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSimulationCreation();
                    }}
                  >
                    <Accordion transition transitionTimeout={200} allowMultiple>
                      <CustomAccordionItem header="Général" initialEntered>
                        <div className="mb-5.5">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="simulation-name"
                          >
                            Nom de la simulation
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="simulation-name"
                            id="simulation-name"
                            required
                            onChange={(e) =>
                              setSimulation({
                                ...simulation,
                                name: e.target.value,
                              })
                            }
                            defaultValue={simulation.name}
                          />
                        </div>
                        <div className="mb-5.5">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="simulation-name"
                          >
                            Taille de la population cible
                            <FaInfoCircle
                              className="relative top-[-2px] ml-2 inline cursor-pointer"
                              color="#1423dc"
                              onClick={() => onOpenModal("0")}
                            />
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number"
                            name="simulation-population"
                            id="simulation-population"
                            onChange={(e) =>
                              setSimulation({
                                ...simulation,
                                properties: {
                                  ...simulation.properties,
                                  final_population_number: Number(
                                    e.target.value,
                                  ),
                                },
                              })
                            }
                            defaultValue={
                              simulation.properties.final_population_number
                            }
                          />
                        </div>
                      </CustomAccordionItem>
                      <CustomAccordionItem header="Modes" initialEntered>
                        <div className="flex gap-5">
                          <div
                            className={`basis-1/2 rounded bg-gray p-2 ${mode === 0 ? "" : "cursor-pointer"}  border-dashed border-primary`}
                            style={{
                              opacity: mode === 0 ? 1 : 0.5,
                              borderWidth: 1,
                            }}
                            onClick={() => handleSelectMode(0)}
                          >
                            <div className="m-2 text-center text-primary">
                              <span>MODE 1</span>
                              <FaInfoCircle
                                className="relative top-[-2px] ml-2 inline cursor-pointer"
                                color="#1423dc"
                                onClick={() => onOpenModal("1")}
                              />
                            </div>
                            <div className={"p-2"}>
                              <div className="mb-5.5">
                                <WeekPicker
                                  disabled={mode !== 0}
                                  onChange={(weekNumber) => {
                                    const old = simulation;
                                    const newSim = {
                                      ...old,
                                      properties: {
                                        ...old.properties,
                                        cut_week_number: weekNumber,
                                      },
                                    };
                                    setSimulation(newSim);
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div
                            className={`basis-1/2 bg-gray p-2 opacity-${mode === 1 ? "100" : 40} rounded ${mode === 1 ? "" : "cursor-pointer"} border-dashed border-primary `}
                            style={{
                              opacity: mode === 1 ? 1 : 0.5,
                              borderWidth: 1,
                            }}
                            onClick={() => handleSelectMode(1)}
                          >
                            <div className="m-2 text-center text-primary">
                              <span>MODE 2</span>
                              <FaInfoCircle
                                className="relative top-[-2px] ml-2 inline cursor-pointer"
                                color="#1423dc"
                                onClick={() => onOpenModal("2")}
                              />
                            </div>
                            <div className={"p-2"}>
                              <div className="mb-5.5">
                                <RangeSlider
                                  min={-20}
                                  max={40}
                                  disabled={mode !== 1}
                                  initialValue={
                                    Math.round(ref.temperatures.tmoy * 10) / 10
                                  }
                                  onChange={(value) => {
                                    setSimulation({
                                      ...simulation,
                                      properties: {
                                        ...simulation.properties,
                                        temperature_target: value,
                                      },
                                    });
                                  }}
                                  label="Température moyenne cible"
                                  units="°C"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CustomAccordionItem>
                      <CustomAccordionItem header="Avancée">
                        <div className="mb-5.5">
                          <RangeSlider
                            min={0}
                            max={5}
                            initialValue={
                              simulation.properties.climat_sensibility
                            }
                            onChange={(value) => {
                              setSimulation({
                                ...simulation,
                                properties: {
                                  ...simulation.properties,
                                  climat_sensibility: value,
                                },
                              });
                            }}
                            label="Sensibilité à la zone climatique"
                            infoIcon={
                              <FaInfoCircle
                                className="relative top-[-2px] mx-1 inline cursor-pointer"
                                color="#1423dc"
                                onClick={() => onOpenModal("3")}
                              />
                            }
                            units=""
                          />
                        </div>
                        <div className="mb-5.5">
                          <RangeSlider
                            min={0}
                            max={5}
                            initialValue={
                              simulation.properties.temperature_sensibility
                            }
                            onChange={(value) => {
                              setSimulation({
                                ...simulation,
                                properties: {
                                  ...simulation.properties,
                                  temperature_sensibility: value,
                                },
                              });
                            }}
                            infoIcon={
                              <FaInfoCircle
                                className="relative top-[-2px] mx-1 inline cursor-pointer"
                                color="#1423dc"
                                onClick={() => onOpenModal("4")}
                              />
                            }
                            label="Sensibilité aux températures"
                            units=""
                          />
                        </div>
                        <div className="mb-5.5">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="simulation-seed"
                          >
                            Seed
                            <FaInfoCircle
                              className="relative top-[-2px] ml-2 inline cursor-pointer"
                              color="#1423dc"
                              onClick={() => onOpenModal("5")}
                            />
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number"
                            min={2}
                            name="simulation-seed"
                            id="simulation-weeks-number"
                            onChange={(e) =>
                              setSimulation({
                                ...simulation,
                                properties: {
                                  ...simulation.properties,
                                  seed: Number(e.target.value),
                                },
                              })
                            }
                            defaultValue={simulation.properties.seed}
                          />
                        </div>
                      </CustomAccordionItem>

                      <div className="mt-5 flex justify-end gap-4.5">
                        <button
                          className="flex justify-center rounded-full border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                          type="submit"
                        >
                          Annuler
                        </button>
                        <button
                          className="flex justify-center rounded-full bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Lancer
                        </button>
                      </div>
                    </Accordion>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-span-5 xl:col-span-2">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Températures{" "}
                    {stats.avg
                      ? `(moyenne: ${Math.round(stats.avg * 10) / 10}°C)`
                      : ""}
                    <FaInfoCircle
                      className="relative top-[-2px] ml-2 inline cursor-pointer"
                      color="#1423dc"
                      onClick={() => onOpenModal("6")}
                    />
                  </h3>
                </div>
                <div>{weatherMap}</div>
              </div>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Population initiale de la simulation
                    <FaInfoCircle
                      className="relative top-[-2px] ml-2 inline cursor-pointer"
                      color="#1423dc"
                      onClick={() => onOpenModal("7")}
                    />
                  </h3>
                </div>

                <div>
                  <select
                    value={simulation.initial_population.file}
                    defaultValue={populationFiles[0]}
                    onChange={(e) => {
                      setSimulation({
                        ...simulation,
                        initial_population: {
                          ...simulation.initial_population,
                          file: e.target.value,
                        },
                      });
                    }}
                    className={`relative z-20 w-full cursor-pointer appearance-none border border-stroke bg-transparent px-12 py-3 outline-none transition  dark:border-form-strokedark dark:bg-form-input ${false ? "text-black dark:text-white" : ""}`}
                  >
                    {populationFiles.map((file) => {
                      return (
                        <option
                          key={file}
                          value={file}
                          className="p-3 text-body dark:text-bodydark"
                        >
                          {file}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="p-7">
                  {uploading ? (
                    <div className="flex items-center justify-center dark:bg-black">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitPopulation();
                      }}
                    >
                      <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                      >
                        <input
                          type="file"
                          accept=".csv"
                          ref={populationFileInput}
                          onChange={(e) => {
                            e.preventDefault();
                            handleNewPopulationFile();
                          }}
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p>
                            <span className="text-primary">
                              {newFileName
                                ? newFileName
                                : "Cliquez pour ajouter un fichier"}
                            </span>
                          </p>
                          <p className="mt-1.5">(seulement .csv)</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4.5">
                        <button
                          className="flex justify-center rounded-full border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                          type="submit"
                        >
                          Annuler
                        </button>
                        <button
                          className="flex justify-center rounded-full bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
