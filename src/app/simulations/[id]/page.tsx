import { DataTable } from "@/components/agenttable/agent-table";
import { columns } from "@/components/agenttable/columns";
import D3AgeDistributionPlot from "@/components/D3AgeDistributionPlot";
import SimulationStatusPoller from "@/components/SimulationStatusPoller";
import {
	readSimulationAgents,
	readSimulationPlans,
	readSimulationResult,
} from "@/lib/serverutils";
import { SimulationPlanRow } from "@/types";
import MapContainer from "@/components/MapContainer";

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

	if (simulationResult?.status !== "Done") {
		return (
			<div className="flex flex-col grow items-center justify-center">
				<SimulationStatusPoller simulationId={slug} />
			</div>
		);
	}
	return (
		<div className="flex flex-col grow p-10 space-y-5">
			<div className="text-3xl">Simulation Results</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 grow gap-5 lg:space-y-0 h-1/2">
				<div className="flex flex-col w-full border-2 rounded-md p-5">
					<MapContainer agentData={agentData} />
				</div>
				<div className="flex flex-col grow border-2 rounded-md py-20">
					<D3AgeDistributionPlot data={agentData} />
				</div>
			</div>
			<div className="flex flex-col border-2 rounded-md overflow-auto">
				<DataTable columns={columns} data={agentData} />
			</div>
		</div>
	);
}
