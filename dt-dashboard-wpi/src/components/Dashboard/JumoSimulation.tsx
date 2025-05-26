"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import useJumoSimulationDataSource, {
  ActiveParticipationType,
  ClientKind,
  EnedisImageType,
} from "@/hooks/useJumoSimulationDataSource";
import { Simulation } from "@/repositories/Simulation/ISimulationRepository";
import Loading from "./Loading";
import Loader from "@/components/common/Loader";
import SimulationsContext from "@/hooks/contexts/SimulationsContext";
import { Department } from "../Maps/MapH3";
import { LatLngBoundsExpression, LatLngExpression, Map } from "leaflet";
import ParticipationRepartition from "../Charts/ParticipationRepartition";
import EnedisImageRepartition from "../Charts/EnedisImageRepartition";
import CardDataStats from "../CardDataStats";
import { FaCalendarWeek, FaInfoCircle, FaUsers } from "react-icons/fa";
import { FaLocationPin, FaTemperatureFull } from "react-icons/fa6";
import useWeather from "@/hooks/useWeather";
import h3ByDepartements from "../../../public/files/geo/h3-by-department.json";
import { weatherRepository } from "@/repositories/Weather/WeatherRepository";
import moment from "moment";
import "moment/locale/fr";
import ActiveParticipationRepartition from "../Charts/ActiveParticipantRepartition";
import ScheduledBehaviourRepartition from "../Charts/ScheduledBehaviourRepartition";
import { Modal } from "../Modal";
import { TemperatureExplanations } from "../Explanations/Temperatures";
import { ClimatExplanations } from "../Explanations/ClimatExplanations";
import { ParticipationMapExplanations } from "../Explanations/ParticipationMapExplanations";
import { ClimatLegendExplanations } from "../Explanations/ClimatLegendExplanations";
import { TemperatureLegendExplanation } from "../Explanations/TemperaturesLegend";

const MapParticipation = dynamic(
  () => import("@/components/Maps/MapParticipation"),
  {
    ssr: false,
  },
);

const MapEnedisImage = dynamic(
  () => import("@/components/Maps/MapEnedisImage"),
  {
    ssr: false,
  },
);

const center = [46.232192999999995, 2.209666999999996] as LatLngExpression;

const initialModalState = {
  "1": false,
  "2": false,
  "3": false,
  "4": false,
  "5": false,
  "6": false,
};

const JumoSimulation: React.FC<{ simulation: Simulation }> = ({
  simulation,
}) => {
  const [simulations] = useContext(SimulationsContext);
  const [participationMap, setParticipationMap] = useState<Map>();
  const [enedisImageMap, setEnedisImageMap] = useState<Map>();
  const currentKind = useRef<ClientKind | null>();
  const [_, setRefreshedCurrentKind] = useState<ClientKind | null>();
  const [modalState, setModalState] =
    useState<Record<string, boolean>>(initialModalState);

  const currentSimulation = useMemo(
    () => simulations.find((s) => s.id === simulation.id),
    [simulation.id, simulations],
  );

  const [location, setLocation] = useState<Department | null>();

  const [
    { participation, enedisImage, activeParticipationType },
    loading,
    refresh,
  ] = useJumoSimulationDataSource(currentSimulation as Simulation);

  const onReset = () => {
    participationMap?.setView(center, 5);
    enedisImageMap?.setView(center, 5);
    setLocation(null);
  };

  const onParticipationReady = (map: Map) => {
    setParticipationMap(map);
  };
  const onEnedisImageReady = (map: Map) => {
    setEnedisImageMap(map);
  };
  const onSelectLocation = (
    location: Department,
    bounds: LatLngBoundsExpression,
  ) => {
    participationMap?.fitBounds(bounds);
    enedisImageMap?.fitBounds(bounds);
    setLocation(location);
  };
  const onSelectKind = (selectedKind: ClientKind) => {
    currentKind.current =
      currentKind.current === selectedKind ? null : selectedKind;
    setRefreshedCurrentKind(currentKind.current);
  };

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

  const { stats, ref } = useWeather(simulation.properties.cut_week_number);

  useEffect(() => {
    let timer = null;
    if (!loading && !Object.keys(participation).length) {
      timer = setTimeout(refresh, 5000);
    }

    return timer ? clearTimeout(timer) : () => { };
  }, [participation, enedisImage, activeParticipationType]);

  const aggregatedParticipationsSeries = useMemo(() => {
    const series = {
      [ClientKind.ActiveParticipant]: 0,
      [ClientKind.PassiveParticipant]: 0,
      [ClientKind.NonParticipant]: 0,
    };

    let total = 0;
    for (const i in participation) {
      const kind = i as keyof typeof participation;
      for (const j in participation[kind]) {
        const h3 = j as keyof (typeof participation)[typeof kind];
        if (
          !location ||
          h3ByDepartements[
            location.code as keyof typeof h3ByDepartements
          ].includes(h3)
        ) {
          series[kind] += participation[kind][h3][0];
          total += participation[kind][h3][0];
        }
      }
    }

    return {
      series: [
        series[ClientKind.ActiveParticipant],
        series[ClientKind.PassiveParticipant],
        series[ClientKind.NonParticipant],
      ],
      total,
    };
  }, [participation, location]);

  const aggregatedActiveParticipationsTypeSeries = useMemo(() => {
    const series = {
      [ActiveParticipationType.Scheduled]: 0,
      [ActiveParticipationType.Modified]: 0,
      [ActiveParticipationType.ScheduledAndModified]: 0,
    };

    let total = 0;
    for (const i in activeParticipationType) {
      const type = i as keyof typeof activeParticipationType;
      for (const j in activeParticipationType[type]) {
        const h3 = j as keyof (typeof activeParticipationType)[typeof type];
        if (
          !location ||
          h3ByDepartements[
            location.code as keyof typeof h3ByDepartements
          ].includes(h3)
        ) {
          series[type] += activeParticipationType[type][h3][0];
          total += activeParticipationType[type][h3][0];
        }
      }
    }

    return {
      series: [
        series[ActiveParticipationType.Scheduled],
        series[ActiveParticipationType.Modified],
        series[ActiveParticipationType.ScheduledAndModified],
      ],
      total,
    };
  }, [activeParticipationType, location]);

  const aggregatedEnedisImageTypeSeries = useMemo(() => {
    const series = {
      [EnedisImageType.Better]: 0,
      [EnedisImageType.Worse]: 0,
      [EnedisImageType.Unchanged]: 0,
    };

    let total = 0;
    for (const i in enedisImage) {
      const type = i as keyof typeof enedisImage;
      for (const j in enedisImage[type]) {
        const h3 = j as keyof (typeof enedisImage)[typeof type];
        if (
          !location ||
          h3ByDepartements[
            location.code as keyof typeof h3ByDepartements
          ].includes(h3)
        ) {
          series[type] += enedisImage[type][h3][1];
          total += enedisImage[type][h3][1];
        }
      }
    }

    return {
      series: [
        series[EnedisImageType.Better],
        series[EnedisImageType.Unchanged],
        series[EnedisImageType.Worse],
      ],
      total,
    };
  }, [enedisImage, location]);

  const aggregatedSchedullingSeries = useMemo(() => {
    // More15kWAndLongUse : Aspirateur, Eclairage, Four, Lave Linge, Lave vaisselle, Plaque de cuisson, Radiateur Electrique, Recharge vehicule electrique, Sèche linge
    // More15kWAndShortUse: Bouilloire, Fer à repasser, Machine à café, Micro-onde |
    // Less15kWAndLongUse: Télévision | Console de jeux, Ordinateur, Box internet
    // Other: Autre
    // [Avant, Pendant, Les 2]
    const series = {
      More15kWAndLongUse: [
        2.82 + 13.38 + 30.28 + 19.01 + 4.23 + 7.04 + 0.7 + 5.64,
        10 + 8.33 + 5 + 1.67 + 13.33 + 1.67,
        1.04 + 4.17 + 10.42 + 7.29 + 18.75 + 1.04 + 1.04,
      ],
      More15kWAndShortUse: [
        2.11 + 2.82 + 1.41 + 2.82,
        10 + 6.67,
        5.21 + 8.33 + 10.42 + 2.08,
      ],
      Less15kWAndLongUse: [
        4.23 + 0.7,
        3.33 + 5 + 18.33,
        1.04 + 6.25 + 10.42 + 4.17,
      ],
      Other: [2.11 + 0.7, 16.67, 8.33],
    };

    return {
      series: [
        {
          name: "Appareils qui ont une forte puissance et un usage longue durée",
          data: series.More15kWAndLongUse.map((value, i) => {
            return Math.round(
              (aggregatedActiveParticipationsTypeSeries.series[i] * value) /
              100,
            );
          }),
        },
        {
          name: "Appareils qui ont une forte puissance et un usage court durée",
          data: series.More15kWAndShortUse.map((value, i) => {
            return Math.round(
              (aggregatedActiveParticipationsTypeSeries.series[i] * value) /
              100,
            );
          }),
        },
        {
          name: "Appareils qui ont une faible puissance et un usage longue durée",
          data: series.Less15kWAndLongUse.map((value, i) => {
            return Math.round(
              (aggregatedActiveParticipationsTypeSeries.series[i] * value) /
              100,
            );
          }),
        },
        {
          name: "Autres appareils",
          data: series.Other.map((value, i) => {
            return Math.round(
              (aggregatedActiveParticipationsTypeSeries.series[i] * value) /
              100,
            );
          }),
        },
      ],
    };
  }, [aggregatedActiveParticipationsTypeSeries, location]);

  if (currentSimulation?.status !== "Done") {
    return (
      <Loading
        message={currentSimulation?.message}
        status={currentSimulation?.status}
      />
    );
  }

  const hasParticipation = !loading && Object.keys(participation).length;
  const hasEnedisImage = !loading && Object.keys(enedisImage).length;
  const hasActiveParticipationType =
    !loading && Object.keys(activeParticipationType).length;

  const participationTitle = {
    [ClientKind.NonParticipant]: "Non participants",
    [ClientKind.PassiveParticipant]: "Participants passifs",
    [ClientKind.ActiveParticipant]: "Participants actifs",
  };

  return (
    <>
      <div className="mb-8 grid grid-cols-4 gap-8">
        <CardDataStats
          title={"Localisation"}
          total={String(location?.name || "France")}
          rate={String(location?.code || "")}
        >
          <FaLocationPin size={20} />
        </CardDataStats>
        <CardDataStats
          title={"Foyers"}
          total={String(aggregatedParticipationsSeries.total)}
          rate={
            String(
              Math.round(
                (1000 * aggregatedParticipationsSeries.total) /
                currentSimulation.properties.final_population_number,
              ) / 10,
            ) + "% cible"
          }
        >
          <FaUsers size={30} />
        </CardDataStats>
        {currentSimulation.properties.mode === 0 ? (
          <CardDataStats
            title={"Semaine"}
            total={`${String(currentSimulation.properties.cut_week_number)}${currentSimulation.properties.cut_week_number === 1 ? "ére" : "ème"
              }`}
            rate={moment()
              .isoWeek(currentSimulation.properties.cut_week_number)
              .format("MMMM")
              .toUpperCase()}
          >
            <FaCalendarWeek size={20} />
          </CardDataStats>
        ) : (
          <CardDataStats
            title={"Température de référence"}
            total={`${Math.round(10 * ref.temperatures.tmoy) / 10}°C`}
            rate={""}
          >
            <FaCalendarWeek size={20} />
          </CardDataStats>
        )}
        {currentSimulation.properties.mode === 0 ? (
          <CardDataStats
            title={"Température moyenne"}
            total={
              location
                ? String(
                  Math.round(
                    weatherRepository.find({
                      department: location.code,
                      week: currentSimulation.properties.cut_week_number,
                    }).tmoy * 10,
                  ) / 10,
                ) + "°C"
                : String(Math.round((stats?.avg || 0) * 10) / 10) + "°C"
            }
            rate=""
          >
            <FaTemperatureFull size={20} />
          </CardDataStats>
        ) : (
          <CardDataStats
            title={"Température moyenne"}
            total={`${currentSimulation.properties.temperature_target}°C`}
            rate=""
          >
            <FaTemperatureFull size={20} />
          </CardDataStats>
        )}
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="relative rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          {hasParticipation ? (
            <ParticipationRepartition
              aggregatedSeries={aggregatedParticipationsSeries}
              location={location}
              onSelection={(kind) => onSelectKind(kind)}
              infoIcon={
                <FaInfoCircle
                  color="#1423dc"
                  onClick={() => onOpenModal("2")}
                />
              }
            />
          ) : (
            <Loader height="full" />
          )}
        </div>
        <Modal isOpen={modalState["2"]} onClose={() => onCloseModal("2")}>
          <h2 className="mb-2 font-bold">
            Participation de la population:{" "}
            <b>
              {aggregatedParticipationsSeries.series[0] +
                aggregatedParticipationsSeries.series[1]}
            </b>{" "}
            (
            <b>
              {Math.round(
                ((aggregatedParticipationsSeries.series[0] +
                  aggregatedParticipationsSeries.series[1]) *
                  10000) /
                aggregatedParticipationsSeries.total,
              ) / 100}
              %
            </b>
            )
          </h2>
          <ol className="list-numeric">
            <li className="mb-2">
              <ul className="ml-5 list-disc">
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#93c90e]">
                    Les participants actifs:{" "}
                  </h3>
                  <p>
                    Nombre de foyers:{" "}
                    <b>{aggregatedParticipationsSeries.series[0]}</b>{" "}
                    <b>
                      (
                      {Math.round(
                        (aggregatedParticipationsSeries.series[0] * 10000) /
                        aggregatedParticipationsSeries.total,
                      ) / 100}
                      %)
                    </b>
                  </p>
                  <p>
                    Les participants actifs sont les foyers qui ont décidés de
                    participer activement à l'expérimentation en modifiant
                    l'usage de leurs appareils avant ou pendant.
                    <br />
                    Une analyse détaillée de cette population est proposé plus
                    bas.
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#1423dc]">
                    Les participants passifs:{" "}
                  </h3>
                  <p>
                    Nombre de foyers:{" "}
                    <b>{aggregatedParticipationsSeries.series[1]}</b> (
                    <b>
                      {Math.round(
                        (aggregatedParticipationsSeries.series[1] * 10000) /
                        aggregatedParticipationsSeries.total,
                      ) / 100}
                      %)
                    </b>
                  </p>
                  <p>
                    Les participants passifs sont les foyers qui ont décidés de
                    participer activement à l'expérimentation en modifiant
                    l'usage de leurs appareils avant ou pendant.
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#fb5454]">
                    Les non participants:{" "}
                  </h3>
                  <p>
                    Nombre de foyers:{" "}
                    <b>{aggregatedParticipationsSeries.series[2]}</b> (
                    <b>
                      {Math.round(
                        (aggregatedParticipationsSeries.series[2] * 10000) /
                        aggregatedParticipationsSeries.total,
                      ) / 100}
                      %)
                    </b>
                  </p>
                  <p>
                    Les non particpants sont les foyers qui ont décidés de ne
                    pas participer à l'expérimentation.
                  </p>
                </li>
              </ul>
            </li>
          </ol>
        </Modal>
        <div className="relative rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          {hasParticipation ? (
            <MapParticipation
              data={participation}
              title={
                currentKind.current
                  ? participationTitle[currentKind.current]
                  : "Méteo"
              }
              climatSensibility={
                currentSimulation.properties.climat_sensibility
              }
              temperatureSensibility={
                currentSimulation.properties.temperature_sensibility
              }
              location={location}
              onReset={onReset}
              week={
                currentSimulation.properties.mode === 1
                  ? null
                  : currentSimulation.properties.cut_week_number
              }
              center={center}
              clientKind={currentKind.current}
              targetTemperature={
                currentSimulation.properties.mode === 1
                  ? currentSimulation.properties.temperature_target
                  : null
              }
              infoIcon={
                <FaInfoCircle
                  color="#1423dc"
                  onClick={() => onOpenModal("1")}
                />
              }
              onReady={onParticipationReady}
              onSelectLocation={onSelectLocation}
            />
          ) : (
            <Loader height="full" />
          )}
        </div>
        <Modal isOpen={modalState["1"]} onClose={() => onCloseModal("1")}>
          {!currentKind.current ? (
            <>
              <TemperatureLegendExplanation />
              <br />
              <ClimatLegendExplanations />
            </>
          ) : (
            <>
              <ParticipationMapExplanations
                clientKind={participationTitle[currentKind.current]}
              />
            </>
          )}
        </Modal>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          {hasActiveParticipationType ? (
            <ActiveParticipationRepartition
              aggregatedSeries={aggregatedActiveParticipationsTypeSeries}
              location={location}
              onSelection={() => { }}
              infoIcon={
                <FaInfoCircle
                  color="#1423dc"
                  onClick={() => onOpenModal("3")}
                />
              }
            />
          ) : (
            <Loader height="full" />
          )}
        </div>

        <Modal isOpen={modalState["3"]} onClose={() => onCloseModal("3")}>
          <h2 className="mb-2 font-bold">
            Comportement des participant actifs
          </h2>
          <ol className="list-numeric">
            <li className="mb-2">
              <p>
                Le comportement des participants actifs se séparent en 3
                catégories distincts
              </p>
              <ul className="ml-5 list-disc">
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#7ab100]">
                    Ceux qui ont anticipé l'usage de leurs appareils:{" "}
                  </h3>
                  <p>
                    <ol>
                      <li>
                        Nombre de participants:{" "}
                        <b>
                          {aggregatedActiveParticipationsTypeSeries.series[0]}{" "}
                        </b>
                      </li>
                      <li>
                        Pourcentage de la population total:{" "}
                        <b>
                          {Math.round(
                            (aggregatedActiveParticipationsTypeSeries
                              .series[0] *
                              10000) /
                            aggregatedParticipationsSeries.total,
                          ) / 100}
                          %
                        </b>
                      </li>
                      <li>
                        Pourcentage de la population des actifs:{" "}
                        <b>
                          {Math.round(
                            (aggregatedActiveParticipationsTypeSeries
                              .series[0] *
                              10000) /
                            aggregatedActiveParticipationsTypeSeries.total,
                          ) / 100}
                          %
                        </b>
                      </li>
                    </ol>
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#93c90e]">
                    Ceux qui ont modifié l'usage des appareils pendant la
                    réduction:{" "}
                  </h3>
                  <p>
                    <ol>
                      <li>
                        Nombre de participants:{" "}
                        <b>
                          {aggregatedActiveParticipationsTypeSeries.series[1]}{" "}
                        </b>
                      </li>
                      <li>
                        Pourcentage de la population total:{" "}
                        <b>
                          {Math.round(
                            (aggregatedActiveParticipationsTypeSeries
                              .series[1] *
                              10000) /
                            aggregatedParticipationsSeries.total,
                          ) / 100}
                          %
                        </b>
                      </li>
                      <li>
                        Pourcentage de la population des actifs:{" "}
                        <b>
                          {Math.round(
                            (aggregatedActiveParticipationsTypeSeries
                              .series[1] *
                              10000) /
                            aggregatedActiveParticipationsTypeSeries.total,
                          ) / 100}
                          %
                        </b>
                      </li>
                    </ol>
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#ace234]">
                    Ceux qui ont anticipé et modifié l'usage des appareils
                    pendant la réduction:{" "}
                  </h3>
                  <p>
                    <ol>
                      <li>
                        Nombre de participants:{" "}
                        <b>
                          {aggregatedActiveParticipationsTypeSeries.series[2]}
                        </b>{" "}
                      </li>
                      <li>
                        Pourcentage de la population total:{" "}
                        <b>
                          {Math.round(
                            (aggregatedActiveParticipationsTypeSeries
                              .series[2] *
                              10000) /
                            aggregatedParticipationsSeries.total,
                          ) / 100}
                          %
                        </b>
                      </li>
                      <li>
                        Pourcentage de la population des actifs:{" "}
                        <b>
                          {Math.round(
                            (aggregatedActiveParticipationsTypeSeries
                              .series[2] *
                              10000) /
                            aggregatedActiveParticipationsTypeSeries.total,
                          ) / 100}
                          %
                        </b>
                      </li>
                    </ol>
                  </p>
                </li>
              </ul>
            </li>
          </ol>
        </Modal>

        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark print:mt-5">
          {hasParticipation ? (
            <ScheduledBehaviourRepartition
              aggregatedSeries={aggregatedSchedullingSeries}
              location={location}
              infoIcon={
                <FaInfoCircle
                  color="#1423dc"
                  onClick={() => onOpenModal("4")}
                />
              }
            />
          ) : (
            <Loader height="full" />
          )}
        </div>
        <Modal
          className="print:mt-5"
          isOpen={modalState["4"]}
          onClose={() => onCloseModal("4")}
        >
          <h2 className="mb-2 font-bold">Report des appareils éléctriques</h2>
          <p className="mb-2">
            Nous pouvons observer la part des appareils éléctriques dont l'usage
            a été modifié pendant la limitation par les participants actifs
            <br />
            <i>
              Exemple: Lors de la limitation{" "}
              <b>{aggregatedSchedullingSeries.series[0].data[0]}</b> des foyers
              actifs ont anticipé l'usage des appareils qui ont une forte
              puissance et un usage long
            </i>
          </p>
          <ol className="list-numeric">
            <li className="mb-2">
              <p>Les appareils éléctriques se séparent en 4 cétégories</p>
              <ul className="ml-5 list-disc">
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#93c90e]">
                    Appareils qui ont une forte puissance et un usage longue
                    durée{" "}
                  </h3>
                  <p>
                    Aspirateur, éclairage, four, lave Linge, lave vaisselle,
                    plaque de cuisson, radiateur éléctrique, recharge véhicule
                    électrique, sèche linge
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#8aa941]">
                    Appareils qui ont une forte puissance et un usage court
                    durée
                  </h3>
                  <p>Bouilloire, Fer à repasser, Machine à café, Micro-onde</p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#7d8a5a]">
                    Appareils qui ont une faible puissance et un usage longue
                    durée
                  </h3>
                  <p>Télévision, Console de jeux, Ordinateur, Box internet</p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#6c6c6c]">
                    Autres appareils
                  </h3>
                  <p></p>
                </li>
              </ul>
            </li>
          </ol>
        </Modal>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          {hasEnedisImage ? (
            <EnedisImageRepartition
              aggregatedSeries={aggregatedEnedisImageTypeSeries}
              location={location}
              infoIcon={
                <FaInfoCircle
                  color="#1423dc"
                  onClick={() => onOpenModal("6")}
                />
              }
            />
          ) : (
            <Loader height="full" />
          )}
        </div>
        <Modal isOpen={modalState["6"]} onClose={() => onCloseModal("6")}>
          <h2 className="mb-2 font-bold">
            Impact de la limitation sur l'image d'Enedis
          </h2>
          <ol className="list-numeric">
            <li className="mb-2">
              <p>L'Image d'Enedis évolue de 3 manières</p>
              <ul className="ml-5 list-disc">
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#93c90e]">
                    Elle devient meilleur après la limitation
                  </h3>
                  <p>
                    Nombre de foyers:{" "}
                    <b>{aggregatedEnedisImageTypeSeries.series[0]}</b>
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#FB5454]">
                    Elle devient moins bonne après la limitation
                  </h3>
                  <p>
                    Nombre de foyers:{" "}
                    <b>{aggregatedEnedisImageTypeSeries.series[2]}</b>
                  </p>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#1423dc]">
                    Elle ne change pas après la limitation
                  </h3>
                  <p>
                    Nombre de foyers:{" "}
                    <b>{aggregatedEnedisImageTypeSeries.series[1]}</b>
                  </p>
                </li>
              </ul>
            </li>
          </ol>
        </Modal>
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          {hasEnedisImage ? (
            <MapEnedisImage
              data={enedisImage}
              title={"Image d'Enedis"}
              center={center}
              week={currentSimulation.properties.cut_week_number}
              onReset={onReset}
              onReady={onEnedisImageReady}
              location={location}
              onSelectLocation={onSelectLocation}
              infoIcon={
                <FaInfoCircle
                  color="#1423dc"
                  onClick={() => onOpenModal("5")}
                />
              }
            />
          ) : (
            <Loader height="full" />
          )}
        </div>

        <Modal isOpen={modalState["5"]} onClose={() => onCloseModal("5")}>
          <h2 className="mb-2 font-bold">
            Dispersion de l'impact de la limitation sur l'image d'Enedis sur le
            territoire
          </h2>
          <p className="mb-2">
            L'objectif est d'observé sur le territoire où l'impact sur l'uimage
            d'Enedis est meilleure ou moins bonne après la limitation. Nous
            n'affichons pas si l'image inchangé est inchangé.
          </p>
          <ol className="list-numeric">
            <li className="mb-2">
              <p>Nous comparons sur le territoire: </p>
              <ul className="ml-5 list-disc">
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#93c90e]">
                    Le nombre de foyers qui ont une vision meilleure d'Enedis
                    après la limitation est plus grande que les foyers qui ont
                    une vision moins bonnes après la limitation
                  </h3>
                </li>
                <li className="my-2">
                  <h3 className="mb-2 font-bold text-[#FB5454]">
                    Le nombre de foyers qui ont une vision moins bonne d'Enedis
                    après la limitation est plus grande que les foyers qui ont
                    une vision meilleure
                  </h3>
                </li>
              </ul>
            </li>
          </ol>
        </Modal>
      </div>
    </>
  );
};

export default JumoSimulation;
