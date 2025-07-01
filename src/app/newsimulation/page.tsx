"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { createSimulation } from "@/lib/serverutils";
import { SimulationParameters } from "@/types";
import { v4 as uuidv4 } from "uuid";

export default function NewSimulation() {
	const router = useRouter();
	const [simDuration, setSimDuration] = useState(168);
	const [futureDuration, setFutSimDuration] = useState(240);
	const [simName, setSimName] = useState("");
	const [trvZ, setTrvZ] = useState(0.82);
	const [envWeight, setEnvWeight] = useState(0.5);
	const [multSwitch, setMultSwitch] = useState(1);
	const [targetPopulation, setTargetPopulation] = useState(26000);

	const handleLaunchSimulation = () => {
		console.log("submitting simulation");
		const params: SimulationParameters = {
			name: simName,
			duration: simDuration,
			seed: 579,
			final_population_number: targetPopulation,
			future_duration: futureDuration,
			future_trv_z: trvZ,
			env_weight: envWeight,
			w2s_mult: multSwitch,
			id: uuidv4(),
		};
		createSimulation(params);
		router.push("/simulations/" + params.id);
	};

	return (
		<div className="flex grow min-h-screen">
			<div className="flex-1 p-8 ml-64">
				{" "}
				{}
				<div className="max-w-7xl mx-auto">
					<h1 className="text-4xl font-bold mb-12 border-b border-gray-700 pb-4">
						Create New Simulation
					</h1>

					<div className="flex flex-wrap gap-6">
						{/* Left Column */}
						<div className="flex-1 min-w-[400px]">
							<div className="bg-accent rounded-lg p-6 mb-6 backdrop-blur-sm">
								<h2 className="text-2xl font-semibold mb-6 ">
									General Settings
								</h2>
								<div className="space-y-6">
									<div>
										<label className="block  mb-2 text-sm">
											Simulation Name
										</label>
										<input
											type="text"
											value={simName}
											onChange={(e) =>
												setSimName(e.target.value)
											}
											className="w-full p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
											placeholder="Enter simulation name"
										/>
									</div>
									<div>
										<label className="block  mb-2 text-sm">
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
											className="w-full p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Right Column */}
						<div className="flex-1 min-w-[400px]">
							<div className="bg-accent rounded-lg p-6 backdrop-blur-sm">
								<h2 className="text-2xl font-semibold mb-6 ">
									Simulation Modes
								</h2>

								<div className="space-y-8">
									<div className="p-4 bg-input rounded-lg">
										<h3 className="text-xl font-medium mb-4 text-accent-foreground">
											Duration
										</h3>
										<div>
											<label className="block mb-2 text-sm">
												Limitation Month{" "}
											</label>
											<input
												type="text"
												value={simDuration}
												onChange={(e) =>
													setSimDuration(
														Number(e.target.value)
													)
												}
												className="w-full p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
											/>
										</div>
										<h3 className="text-xl font-medium mb-4 text-accent-foreground">
											Future Duration
										</h3>
										<div>
											<label className="block mb-2 text-sm">
												Limitation Month{" "}
											</label>
											<input
												type="text"
												value={futureDuration}
												onChange={(e) =>
													setFutSimDuration(
														Number(e.target.value)
													)
												}
												className="w-full p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-4 mt-8">
						<button className="px-8 py-3 rounded-lg   hover:bg-gray-600 transition-colors">
							Cancel
						</button>
						<button
							className="px-8 py-3 rounded-lg   hover:bg-blue-500 transition-colors"
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
