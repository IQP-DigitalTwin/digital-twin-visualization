import { SimulationParameters } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createSimulation(
    newSimulation: SimulationParameters,
): Promise<File> {
    const res = await fetch("/api/simulations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newSimulation)
    })
    const json = await res.json();

    return json.new;
}

export async function getSimulationRepositorybyID(id: string) {
    const file = await fetch("/files/simulations/" + id)
    return file;
}