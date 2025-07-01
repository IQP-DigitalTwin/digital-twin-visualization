import { NextResponse } from "next/server";
import { readSimulationResult } from "@/lib/serverutils";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "Missing simulation ID" }, { status: 400 });
    }

    const simulation = await readSimulationResult(id);

    if (!simulation) {
        return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    return NextResponse.json({ status: simulation.status });
}
