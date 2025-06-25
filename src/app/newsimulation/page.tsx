"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { createSimulation } from "@/lib/utils";
import { SimulationParameters } from "@/types";
import {v4 as uuidv4} from "uuid";

export default function NewSimulation() {
	const router = useRouter();
	const [simDuration, setSimDuration] = useState(83);
	const [simName, setSimName] = useState("");
	const [targetPopulation, setTargetPopulation] = useState(26000);

	const handleLaunchSimulation = () => {
		console.log("submitting simulation");
		const params: SimulationParameters = {
			name: simName,
			duration: simDuration,
			seed: 579,
			final_population_number: targetPopulation,
			id: uuidv4(),
		};
		createSimulation(params);
        router.push("/simulations/" + params.id)
	};

	return (
		<div className="flex min-h-screen bg-gray-900">
			<Sidebar />
			<div className="flex-1 p-8 ml-64">
				{" "}
				{}
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl font-bold mb-12 text-white border-b border-gray-700 pb-4">
						Create New Simulation
					</h1>

					<div className="flex flex-wrap gap-6">
						{/* Left Column */}
						<div className="flex-1 min-w-[400px]">
							<div className="bg-gray-800/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
								<h2 className="text-2xl font-semibold mb-6 text-white">
									General Settings
								</h2>
								<div className="space-y-6">
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Simulation Name
										</label>
										<input
											type="text"
											value={simName}
											onChange={(e) =>
												setSimName(e.target.value)
											}
											className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
											placeholder="Enter simulation name"
										/>
									</div>
									<div>
										<label className="block text-gray-300 mb-2 text-sm">
											Target Population Size
										</label>
										<input
											type="number"
											value={targetPopulation}
											onChange={(e) =>
												setTargetPopulation(
													Number(e.target.value)
												)
											}
											className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Right Column */}
						<div className="flex-1 min-w-[400px]">
							<div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
								<h2 className="text-2xl font-semibold mb-6 text-white">
									Simulation Modes
								</h2>

								<div className="space-y-8">
									<div className="p-4 bg-gray-700/30 rounded-lg">
										<h3 className="text-xl font-medium mb-4 text-blue-400">
											Duration
										</h3>
										<div>
											<label className="block text-gray-300 mb-2 text-sm">
												Limitation Month{" "}
											</label>
											<input
												type="text"
												value={simDuration}
												onChange={(e) =>
													setSimDuration(Number(e.target.value))
												}
												className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-4 mt-8">
						<button
							className="px-8 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
							onClick={() => window.history.back()}
						>
							Cancel
						</button>
						<button
							className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
							onClick={handleLaunchSimulation}
						>
							Launch Simulation
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
