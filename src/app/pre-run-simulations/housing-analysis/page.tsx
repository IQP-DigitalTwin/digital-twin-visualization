"use client";
import { useState } from "react";

export default function HousingAnalysis() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Housing Status Analysis</h1>

			<section className="bg-gray-800 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">
					Simulation Results
				</h2>
				<div className="space-y-4">
					<div className="placeholder-chart bg-gray-700 h-[400px] rounded-lg">
						{/* Chart will be added here */}
					</div>
				</div>
			</section>

			<section className="bg-gray-800 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Analysis</h2>
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Key Findings</h3>
					<ul className="list-disc list-inside space-y-2">
						<li>
							Home ownership status affects decision-making
							patterns
						</li>
						<li>
							Renters show different provider switching behaviors
						</li>
						<li>
							Length of residence impacts willingness to change
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
