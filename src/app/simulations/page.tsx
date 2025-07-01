"use client";
import { SimulationResults } from "@/types";
import { readSimulations } from "@/lib/serverutils";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Simulations() {
	const [simulations, setSimulations] = useState<SimulationResults[]>([]);

	useEffect(() => {
		async function getSims() {
			const sims = await readSimulations();
			setSimulations(sims);
		}
		getSims();
	}, []);
	return (
		<div className="flex flex-col text-left grow space-y-5 p-25">
			<div className="flex flex-row grow justify-between">
				<div className="font-bold text-4xl">Simulations List</div>
                <Button variant="default" className="p-5" asChild>
                    <Link href="/newsimulation">
                        <Plus/>
                    </Link>
                </Button>
			</div>

			{simulations.length === 0 ? (
				<div className="text-xl text-gray-500">
					No simulation results available to display
				</div>
			) : (
				simulations.map((i) => {
					return (
						<Link
							key={i.id}
							className="flex flex-row items-center py-2 px-10 rounded-sm bg-accent hover:cursor-pointer hover:bg-blue-100"
							href={"simulations/" + i.id}
						>
							<div className="flex-1 text-left text-2xl">
								{i.name}
							</div>
							<div className="flex-1 text-center text-2xl">
								{i.status}
							</div>
							<div className="flex-1 text-right text-2xl">
								{String(i.createdAt)}
							</div>
						</Link>
					);
				})
			)}
		</div>
	);
}
