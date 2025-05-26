import { NextResponse } from "next/server";
import {
  Simulation,
  simulationSchema,
} from "@/repositories/Simulation/ISimulationRepository";
import SimulationRepository from "@/repositories/Simulation/SimulationRepository";
import { getErrorMessage } from "@/utils";
import { getHostUrl, getRandomWorkersUrls } from "@/utils/env";
const simulationRepository = new SimulationRepository();

export async function GET() {
  const simulations = await simulationRepository.findAll();
  return NextResponse.json<Simulation[]>(simulations, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newSimulation = {
    ...body,
    createdAt: new Date(new Date().toUTCString()),
    updatedAt: new Date(new Date().toUTCString()),
  };

  const parseBody = simulationSchema.safeParse(newSimulation);

  if (!parseBody.success) {
    return NextResponse.json<{ errors: unknown }>(
      { errors: parseBody.error.issues },
      { status: 500 },
    );
  }

  const simulation = await simulationRepository.create(newSimulation);
  try {
    const workerUrl = getRandomWorkersUrls();
    const res = await fetch(`${workerUrl}/api/simulations/${simulation.id}`, {
      method: "POST",
      headers: {
        Referer: getHostUrl(),
      },
      body: JSON.stringify(simulation),
    });

    if (!res.ok) {
      throw new Error("Worker request error");
    }

    await simulationRepository.update(simulation.id, {
      status: "Created",
      message: "La simulation a été crée",
      lastTaskId: await res.json(),
    });
  } catch (e) {
    await simulationRepository.update(simulation.id, {
      status: "Error",
      message: getErrorMessage(e),
    });
  }

  return NextResponse.json<{ new: Simulation }>(
    { new: simulation },
    { status: 200 },
  );
}
