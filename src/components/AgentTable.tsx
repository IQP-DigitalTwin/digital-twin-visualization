"use client";
import React, { useState, useMemo } from "react";
import { SimulationAgentRow } from "@/types/types";

interface AgentTableProps {
	data: SimulationAgentRow[];
}

const columns: { key: keyof SimulationAgentRow; label: string }[] = [
	{ key: "CP", label: "CP" },
	{ key: "HABITAT", label: "Habitat" },
	{ key: "Revenu", label: "Revenu" },
	{ key: "age", label: "Age" },
	{ key: "change_prob", label: "Change Prob" },
	{ key: "green_sensitivity", label: "Green Sensitivity" },
	{ key: "id", label: "ID" },
	{ key: "num_times_switched", label: "Num Times Switched" },
	{ key: "plan", label: "Plan" },
	{ key: "price_sensitivity", label: "Price Sensitivity" },
	{ key: "satisfaction_threshold", label: "Satisfaction Threshold" },
	{ key: "supplier", label: "Supplier" },
];

const AgentTable: React.FC<AgentTableProps> = ({ data }) => {
	const [search, setSearch] = useState("");

	const filteredAgents = useMemo(() => {
		if (!search) return data;
		const lower = search.toLowerCase();
		return data.filter((agent) =>
			columns.some((col) =>
				String(agent[col.key]).toLowerCase().includes(lower)
			)
		);
	}, [search, data]);

	return (
		<div className="w-full">
			<div className="mb-2 flex justify-between items-center">
				<span className="font-bold text-xl">Agents</span>
				<input
					type="text"
					className="border rounded px-2 py-1"
					placeholder="Search agents..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="overflow-x-auto max-h-[600px] border rounded">
				<table className="min-w-full text-sm">
					<thead className="bg-gray-100 sticky top-0 z-10">
						<tr>
							{columns.map((col) => (
								<th
									key={col.key as string}
									className="px-2 py-1 border-b text-left"
								>
									{col.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredAgents.map((agent, idx) => (
							<tr
								key={agent.id + "-" + idx}
								className="hover:bg-gray-50"
							>
								{columns.map((col) => (
									<td
										key={col.key as string}
										className="px-2 py-1 border-b"
									>
										{agent[col.key]}
									</td>
								))}
							</tr>
						))}
						{filteredAgents.length === 0 && (
							<tr>
								<td
									colSpan={columns.length}
									className="text-center py-4 text-gray-400"
								>
									No agents found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AgentTable;
