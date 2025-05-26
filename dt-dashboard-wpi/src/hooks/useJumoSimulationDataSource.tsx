import h5wasm from "h5wasm";
import { useState, useEffect } from "react";
import { Simulation } from "@/repositories/Simulation/ISimulationRepository";
import { deserializeSimulationHeader } from "@/utils";
export enum ClientKind {
  ActiveParticipant = "ActiveParticipant",
  PassiveParticipant = "PassiveParticipant",
  NonParticipant = "NonParticipant",
}

export enum ActiveParticipationType {
  Scheduled = "Scheduled",
  Modified = "Modified",
  ScheduledAndModified = "ScheduledAndModified",
}

export enum EnedisImageType {
  Better = "Better",
  Worse = "Worse",
  Unchanged = "Unchanged",
}

const useJumoSimulationDataSource = (
  simulation: Simulation,
): [
  {
    participation: Record<ClientKind, Record<string, number[]>>;
    activeParticipationType: Record<
      ActiveParticipationType,
      Record<string, number[]>
    >;
    enedisImage: Record<EnedisImageType, Record<string, number[]>>;
  },
  boolean,
  () => void,
] => {
  const [dataSources, setDataSources] = useState<{
    participation: Record<string, Record<string, number[]>>;
    activeParticipationType: Record<string, Record<string, number[]>>;
    enedisImage: Record<string, Record<string, number[]>>;
  }>({
    participation: {},
    activeParticipationType: {},
    enedisImage: {},
  });

  const [loading, setLoading] = useState<boolean>(false);

  function load() {
    if (!loading) {
      setLoading(true);
      h5wasm.ready.then(async ({ FS }) => {
        const response = await fetch(`/api/simulations/${simulation.id}.h5`);

        if (!response.ok) {
          return;
        }

        const ab = await response.arrayBuffer();
        FS.writeFile(`${simulation.id}.nxs.ngv`, new Uint8Array(ab));
        const h5 = new h5wasm.File(`${simulation.id}.nxs.ngv`, "r");
        // @ts-ignore
        const data = h5.get("1/data")?.to_array();
        let participationDataSource: Record<
          string,
          Record<string, number[]>
        > = {};
        let activeParticipationTypeDataSource: Record<
          string,
          Record<string, number[]>
        > = {};
        let enedisImageDataSource: Record<
          string,
          Record<string, number[]>
        > = {};

        h5
          .get("1/meta")
          // @ts-ignore
          ?.to_array()
          .forEach((name: string, i: number) => {
            const headerDesserialized = deserializeSimulationHeader(name);
            const index = headerDesserialized.h3;
            if (!index) {
              return;
            }

            if (headerDesserialized.name === "participation") {
              const kind = headerDesserialized.kind;

              if (!participationDataSource?.[kind]) {
                participationDataSource[kind] = {};
              }

              participationDataSource[kind][index] = data[i] || [];
            }

            if (headerDesserialized.name === "scheduled") {
              const type = headerDesserialized.type;

              if (!activeParticipationTypeDataSource?.[type]) {
                activeParticipationTypeDataSource[type] = {};
              }

              activeParticipationTypeDataSource[type][index] = data[i] || [];
            }

            if (headerDesserialized.name === "enedisCorporateImage") {
              const type = headerDesserialized.type;

              if (!enedisImageDataSource?.[type]) {
                enedisImageDataSource[type] = {};
              }

              enedisImageDataSource[type][index] = data[i] || [];
            }
          });

        setDataSources({
          participation: participationDataSource,
          activeParticipationType: activeParticipationTypeDataSource,
          enedisImage: enedisImageDataSource,
        });

        setLoading(false);
      });
    }
  }

  function refresh() {
    load();
  }

  useEffect(() => {
    if (
      !simulation ||
      simulation.status !== "Done" ||
      (Object.keys(dataSources.participation).length > 0 &&
        Object.keys(dataSources.enedisImage).length > 0 &&
        Object.keys(dataSources.activeParticipationType).length > 0)
    ) {
      return;
    }

    load();
  }, [simulation]);

  return [dataSources, loading, refresh];
};

export default useJumoSimulationDataSource;
