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
		if (!res.ok) {
			throw new Error("Worker request error");
		}
	} catch (e) {
		return e;
	}
	const sims = await readSimulations();
	sims.push(simulation);
	await writeSimulations(sims);
	return NextResponse.json<{ new: SimulationResults }>(
		{ new: simulation },
		{ status: 200 }
	);
}
