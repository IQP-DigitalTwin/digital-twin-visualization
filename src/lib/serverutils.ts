"use server";
import { SimulationParameters, SimulationAgentRow, SimulationPlanRow } from "@/types";
import { SimulationResults } from "@/types";
import * as d3 from "d3-dsv";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getHostUrl } from "./env";

const SIM_DB_PATH = path.join(
	process.cwd(),
	"public/files/simulations/simulations.json"
);
const SIM_PATH = path.resolve(process.cwd(), "public/files/simulations");

export async function readSimulations(): Promise<SimulationResults[]> {
    try {
        const data = await fs.readFile(SIM_DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (err: any) {
        // If file doesn't exist, create it as an empty array
        if (err.code === "ENOENT") {
            await fs.mkdir(path.dirname(SIM_DB_PATH), { recursive: true });
            await fs.writeFile(SIM_DB_PATH, "[]", "utf-8");
            return [];
        }
        return [];
    }
}

export async function readSimulationAgents(id: string | undefined): Promise<SimulationAgentRow[]> {
    if (typeof id !== "string" || !id) {
        console.error("Invalid simulation id provided to readSimulationAgents:", id);
        return [];
    }
    try {
        const filePath = path.join(SIM_PATH, id, `${id}-agents.csv`);
        const csvString = await fs.readFile(filePath, "utf-8");
        const data = d3.csvParse(csvString, (d): SimulationAgentRow => ({
            CP: d.CP ?? "",
            HABITAT: d.HABITAT ?? "",
            Revenu: Number(d.Revenu),
            age: Number(d.age),
            change_prob: Number(d.change_prob),
            green_sensitivity: Number(d.green_sensitivity),
            id: Number(d.id),
            num_times_switched: Number(d.num_times_switched),
            plan: d.plan ?? "",
            price_sensitivity: Number(d.price_sensitivity),
            satisfaction_threshold: Number(d.satisfaction_threshold),
            supplier: d.supplier ?? "",
        }));
        return data;
    } catch (e) {
        console.error("Error reading simulation agents CSV:", e);
        return [];
    }
}

export async function writeSimulations(sims: SimulationResults[]) {
    try {
        await fs.mkdir(path.dirname(SIM_DB_PATH), { recursive: true });
        await fs.writeFile(SIM_DB_PATH, JSON.stringify(sims, null, 2), "utf-8");
    } catch (err) {
        console.error("Error writing simulations.json:", err);
    }
}

export async function deleteSimulation(id: string) {
    try {
        const sims = await readSimulations();
        const updatedSims = sims.filter(sim => sim.id !== id);
        await writeSimulations(updatedSims);

        const simDir = path.join(SIM_PATH, id);
        if (existsSync(simDir)) {
            await fs.rm(simDir, { recursive: true, force: true });
        }
    } catch (err) {
        console.error("Error deleting simulation:", err);
    }
}

export async function createSimulation(
	newSimulation: SimulationParameters
) {
	const res = await fetch(`${getHostUrl()}/api/simulations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newSimulation),
	});
	const json = await res.json();

	return json.new;
}
export async function readSimulationPlans(id: string | undefined): Promise<{ data: SimulationPlanRow[]; columns: string[] }> {
    if (typeof id !== "string" || !id) {
        console.error("Invalid simulation id provided to readSimulationPlans:", id);
        return { data: [], columns: [] };
    }
    try {
        const filePath = path.join(SIM_PATH, id, `${id}-plans.csv`);
        const csvString = await fs.readFile(filePath, "utf-8");
        const parsed = d3.csvParse(csvString);

        const columns = parsed.columns.filter(col => col !== "time");
        const data: SimulationPlanRow[] = parsed.map(row => {
            const result: SimulationPlanRow = {
                time: Number(row.time),
            };
            for (const col of columns) {
                result[col] = Number(row[col]);
            }
            return result;
        });
        return { data, columns };
    } catch (e) {
        console.error("Error reading simulation plans CSV:", e);
        return { data: [], columns: [] };
    }
}

export async function updateSimulationStatus(id: string, status: string) {
    const simDbPath = path.join(process.cwd(), "public/files/simulations/simulations.json");
    try {
        // Read and parse the simulations.json file
        let sims = [];
        try {
            const data = await fs.readFile(simDbPath, "utf-8");
            sims = JSON.parse(data);
        } catch (err: any) {
            if (err.code === "ENOENT") {
                // If file doesn't exist, create it as an empty array
                await fs.mkdir(path.dirname(simDbPath), { recursive: true });
                await fs.writeFile(simDbPath, "[]", "utf-8");
                sims = [];
            } else {
                throw err;
            }
        }

        // Update the status for the simulation with the given id
        let updated = false;
        sims = sims.map((sim: SimulationResults) => {
            if (sim.id === id) {
                updated = true;
                return { ...sim, status };
            }
            return sim;
        });

        // Only write if we actually updated something
        if (updated) {
            await fs.writeFile(simDbPath, JSON.stringify(sims, null, 2), "utf-8");
        }
    } catch (err) {
        console.error("Error updating simulation status:", err);
    }
}

export async function readSimulationResult(id: string): Promise<SimulationResults | undefined> {
    try {
        const data = await fs.readFile(SIM_DB_PATH, "utf-8");
        const sims: SimulationResults[] = JSON.parse(data);
        return sims.find(sim => sim.id === id);
    } catch (err) {
        console.error("Couldn't find simulation results:", err);
        return undefined;
    }
}