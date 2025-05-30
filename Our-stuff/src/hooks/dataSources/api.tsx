import { Simulation } from "@/repositories/Simulation/ISimulationRepository";

export async function createSimulation(
	newSimulation: Simulation,
): Promise<Simulation> {
	const res = await fetch("/api/simulations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newSimulation),
	});

	const json = await res.json();

	return json.new;
}

export async function getSimulations(): Promise<Simulation[]> {
	const res = await fetch("/api/simulations", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return res.json();
}

export async function getSimulation(id: string): Promise<Simulation> {
	const res = await fetch("/api/simulations/" + id, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return res.json();
}

export async function deleteSimulation(id: string): Promise<Simulation> {
	const res = await fetch("/api/simulations/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return res.json();
}

export async function getPopulationFiles(): Promise<string[]> {
	const res = await fetch("/api/populations", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	return res.json();
}

export async function addPopulationFile(file: Blob): Promise<void> {
	const data = new FormData();
	data.append("file", file);

	const res = await fetch("/api/populations", {
		method: "POST",
		body: data,
	});

	return res.json();
}
