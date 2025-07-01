import { DataTable } from "@/components/agenttable/agent-table";
import { columns } from "@/components/agenttable/columns";
import D3Map from "@/components/D3Map";
import D3PlansPlot from "@/components/D3PlansPlot";
import {
	readSimulationAgents,
	readSimulationPlans,
	readSimulationResult,
} from "@/lib/serverutils";
import { SimulationPlanRow } from "@/types";

export default async function Simulations({
	params,
}: {
	params: { id: string };
}) {
	const idslug = await params;
	const slug = idslug.id;
	const simulationResult = slug
		? await readSimulationResult(slug)
		: { status: "Created" };
	const agentData =
		simulationResult?.status == "Done"
			? await readSimulationAgents(slug)
			: [];
	let plansData: SimulationPlanRow[] = [];
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
		<div className="flex flex-col grow">
			<div className="flex flex-row grow">
                <div className="flex flex-col grow">
                    <D3Map data={agentData}></D3Map>
                </div>
                <div className="flex flex-col grow justify-center items-center">
                    <D3PlansPlot data={plansData} columns={planColumns}/>
                </div>
			</div>
			<div className="flex flex-col w-full justify-center items-center">
				{/* <DataTable columns={columns} data={agentData} /> */}
			</div>
		</div>
	);
}
