import SimulationResults from "@/app/simulation-results/page";
import { getHostUrl, getRandomWorkersUrls } from "@/lib/env";
import { SimulationParameters } from "@/types";


export async function POST(req: Request){
    const body = await req.json();
    const simulation: SimulationParameters = {
        ...body
    }

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
        return 500;
    }
    return NextResponse.json<{new: };
}