"use client";
import { SimulationResults } from "@/types";
import { readSimulations } from "@/lib/serverutils";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

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
		<div className="flex flex-row">
			<Sidebar />
			<div className="flex flex-col text-center grow space-y-5 p-5">
				<div className="font-bold text-4xl">Simulations List</div>
				<div className=""></div>
				{simulations.map((i) => {
					return (
                        <Link
                            key={i.id}
                            className="flex flex-row items-center py-2 px-10 bg-accent rounded-2xl border-2 border-primary hover:bg-slate-500"
                            href={"simulations/" + i.id}
                        >
                            <div className="flex-1 text-left text-2xl">{i.name}</div>
                            <div className="flex-1 text-center text-2xl">{i.status}</div>
                            <div className="flex-1 text-right text-2xl">{String(i.createdAt)}</div>
                            
                        </Link>
					);
				})}
			</div>
		</div>
	);
}
