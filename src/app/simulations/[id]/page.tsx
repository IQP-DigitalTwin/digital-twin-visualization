import AgentTable from "@/components/AgentTable";
import D3Map from "@/components/D3Map";
import D3PlansPlot from "@/components/D3PlansPlot";
import Sidebar from "@/components/Sidebar";
import { readSimulationAgents, readSimulationPlans, readSimulationResult } from "@/lib/serverutils";

export default async function Simulations({
	params,
}: {
	params: { id: string };
}) {
	const slug = params.id;
	const simulationResult = slug ? await readSimulationResult(slug) : null;
	const agentData =
		simulationResult?.status == "Done"
			? await readSimulationAgents(slug)
			: [];
    let plansData: any[] = [];
    let planColumns: string[] = [];
    if (simulationResult?.status == "Done") {
        const plansResult = await readSimulationPlans(slug);
        plansData = plansResult.data;
        planColumns = plansResult.columns;
    }

	if (simulationResult?.status === "Created") {
		const { Suspense } = await import("react");
		return (
			<div className="flex flex-row min-h-screen justify-center p-10">
				<Suspense>
					<div className="w-full flex items-center justify-center">
						<span className="text-lg">Loading simulation...</span>
					</div>
				</Suspense>
			</div>
		);
	}
	return (
		<div className="flex flex-row">
			<Sidebar />
			<div className="flex flex-col grow min-h-screen justify-center p-10">
				<D3Map data={agentData}></D3Map>
                <D3PlansPlot data={plansData} columns={planColumns} width={1000} height={800}/>
                <AgentTable data={agentData}/>
			</div>
		</div>
	);
}
