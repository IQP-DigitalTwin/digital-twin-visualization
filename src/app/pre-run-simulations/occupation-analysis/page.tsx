"use client";
import { useState } from "react";

export default function OccupationAnalysis() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Occupation Impact Analysis</h1>

			<section className="bg-gray-800 p-6 rounded-lg">
				<h2 className="text-xl font-semibold mb-4">
					Simulation Results
				</h2>
				<div className="space-y-4">
					<div className="placeholder-chart bg-gray-700 h-[400px] rounded-lg" />
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-700 p-4 rounded-lg">
							<h4 className="font-medium mb-2">
								Work Schedule Impact
							</h4>
							<p className="text-gray-300">
								Effect of working hours on energy choices
							</p>
						</div>
						<div className="bg-gray-700 p-4 rounded-lg">
							<h4 className="font-medium mb-2">
								Income Level Impact
							</h4>
							<p className="text-gray-300">
								Correlation with financial factors
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
							Work schedule flexibility affects provider
							preferences
						</li>
						<li>Income levels correlate with switching behavior</li>
						<li>
							Industry sector shows distinct patterns in energy
							choices
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}
