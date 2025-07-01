import { getHostUrl, getRandomWorkersUrls } from "@/lib/env";
import { SimulationParameters, SimulationResults } from "@/types";
import { NextResponse } from "next/server";
import { readSimulations, writeSimulations } from "@/lib/serverutils";


export async function POST(req: Request) {
	const body = await req.json();
	const newSimulation: SimulationParameters = {
		...body,
	};
	const simulation: SimulationResults = {
		id: newSimulation.id,
		name: newSimulation.name,
		parameters: newSimulation,
		status: "Created",
		createdAt: new Date(),
	};
	try {
		const workerURL = getRandomWorkersUrls();
		console.log("workerURL: ", workerURL);
		const res = await fetch(
			`${workerURL}/api/simulations/${simulation.id}`,
			{
				method: "POST",
				headers: {
					Referer: getHostUrl(),
				},
				body: JSON.stringify(simulation),
			}
		);
        //This will fail if there is no worker response from worker URL!!!!
		if (!res.ok) {
			throw new Error("Worker request error");
		}
	} catch (e) {
        console.error("Error in simulation POST:", e);
        // If the worker request fails, we still want to save the simulation with status "Created"
        simulation.status = "Created";
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : String(e) },
			{ status: 500 }
		);
	}

	const sims = await readSimulations();
	sims.push(simulation);
	await writeSimulations(sims);

	return NextResponse.json<{ new: SimulationResults }>(
		{ new: simulation },
		{ status: 200 }
	);
}
