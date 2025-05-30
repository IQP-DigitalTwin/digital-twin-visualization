import JumoSimulation from "@/components/Dashboard/JumoSimulation";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SimulationRepository from "@/repositories/Simulation/SimulationRepository";
import { redirect } from "next/navigation";
const simulationRepository = new SimulationRepository();

export const metadata: Metadata = {
  title: "Enedis - Jumeau Numerique",
  description: "",
};

export default async function Simulation({
  params,
}: {
  params: { id: string };
}) {
  const sim = await simulationRepository.findById(params.id);

  if (!sim) {
    redirect("/");
  }

  return (
    <>
      <DefaultLayout title={sim?.name} simId={params.id}>
        <JumoSimulation simulation={sim} />
      </DefaultLayout>
    </>
  );
}
