"use client";
import { useState } from "react";

export default function PeakUsageAnalysis() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Peak Usage Analysis</h1>

			<section className="bg-gray-800 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">
					Simulation Results
				</h2>
				<div className="space-y-4">
					<div className="placeholder-chart bg-gray-700 h-[400px] rounded-lg" />
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-700 p-4 rounded-lg">
							<h4 className="font-medium mb-2">
								Peak Hours Usage
							</h4>
							<p className="text-gray-300">
								Consumer behavior during 2PM - 8PM
							</p>
						</div>
						<div className="bg-gray-700 p-4 rounded-lg">
							<h4 className="font-medium mb-2">
								Off-Peak Hours Usage
							</h4>
							<p className="text-gray-300">
								Consumer behavior during other hours
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-gray-800 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">Analysis</h2>
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Key Findings</h3>
					<ul className="list-disc list-inside space-y-2">
						<li>
							Time-of-use pricing significantly affects switching
							behavior
						</li>
						<li>Peak hour rates influence consumer decisions</li>
						<li>
							Flexibility in usage timing correlates with provider
							switching
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
