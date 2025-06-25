import { getHostUrl, getRandomWorkersUrls } from "@/lib/env";
import { SimulationParameters, SimulationResults } from "@/types";
import { NextResponse } from "next/server";
const simulationRepository: {[id: string]: SimulationResults} = {};

async function createSimRepo(simulation: SimulationParameters): Promise<SimulationResults> {
    if (simulation.id in simulationRepository){
        throw new Error(`The simulation ${simulation.id} already exists`)
    }

    const simulationResults: SimulationResults = {
        "id": simulation.id,
        "name": simulation.name,
        "parameters": simulation,
        "status": "Created",
        "createdAt": new Date()
    }

    return simulationResults;
}

export async function POST(req: Request){
    const body = await req.json();
    const newSimulation: SimulationParameters = {
        ...body
    }
    const simulation = await createSimRepo(newSimulation)
    try{
        const workerURL = getRandomWorkersUrls();
        console.log("workerURL: ", workerURL);
        const res = await fetch(`${workerURL}/api/simulations/${simulation.id}`, {
            method: "POST",
            headers: {
                Referer: getHostUrl(),
            },
            body: JSON.stringify(simulation),
        });
        if (!res.ok) {
            throw new Error("Worker request error");
        }
    } catch (e) {
        return e;
    }
    return NextResponse.json<{new: SimulationResults}>(
        {new: simulation},
        {status: 200}
    );
}