"use client";
import { useSearchParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import AnalysisChart from "../../components/AnalysisChart";
import { useState, useEffect } from "react";
import { useCsvData } from "../hooks/useCsvData";

interface ChartDataset {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
	tension: number;
}

interface ChartData {
	labels: string[];
	datasets: ChartDataset[];
}

interface AnalysisDataState {
	ageImpact: ChartData;
	regionalClimate: ChartData;
	housingStatus: ChartData;
	peakUsage: ChartData;
	occupation: ChartData;
	stabilityPreference: ChartData;
}

function SimulationResults() {
	const searchParams = useSearchParams();
	const simName = searchParams.get("name");
	const population = searchParams.get("population");
	const { data: csvData, loading } = useCsvData("/test.csv");

	const [analysisData, setAnalysisData] = useState<AnalysisDataState>(() => ({
		ageImpact: {
			labels: ["18-25", "26-35", "36-45", "46-55", "56+"],
			datasets: [
				{
					label: "Switch Rate by Age",
					data: [],
					borderColor: "rgb(75, 192, 192)",
					backgroundColor: "rgba(75, 192, 192, 0.2)",
					tension: 0.1,
				},
			],
		},
		regionalClimate: {
			labels: ["North", "South", "East", "West", "Central"],
			datasets: [
				{
					label: "Regional Switch Rate",
					data: [],
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.2)",
					tension: 0.1,
				},
			],
		},
		housingStatus: {
			labels: ["Owned", "Rented", "Other"],
			datasets: [
				{
					label: "Housing Impact",
					data: [],
					borderColor: "rgb(153, 102, 255)",
					backgroundColor: "rgba(153, 102, 255, 0.2)",
					tension: 0.1,
				},
			],
		},
		peakUsage: {
			labels: ["Morning", "Afternoon", "Evening", "Night"],
			datasets: [
				{
					label: "Peak Usage Patterns",
					data: [],
					borderColor: "rgb(255, 159, 64)",
					backgroundColor: "rgba(255, 159, 64, 0.2)",
					tension: 0.1,
				},
			],
		},
		occupation: {
			labels: ["Professional", "Service", "Manufacturing", "Other"],
			datasets: [
				{
					label: "Occupation Impact",
					data: [],
					borderColor: "rgb(54, 162, 235)",
					backgroundColor: "rgba(54, 162, 235, 0.2)",
					tension: 0.1,
				},
			],
		},
		stabilityPreference: {
			labels: ["Very Stable", "Moderate", "Flexible", "Risk-Taking"],
			datasets: [
				{
					label: "Stability Preference Impact",
					data: [],
					borderColor: "rgb(255, 206, 86)",
					backgroundColor: "rgba(255, 206, 86, 0.2)",
					tension: 0.1,
				},
			],
		},
	}));

	useEffect(() => {
		if (csvData) {
			setAnalysisData((prev) => ({
				...prev,
				ageImpact: {
					...prev.ageImpact,
					datasets: [
						{
							...prev.ageImpact.datasets[0],
							data: csvData.switchRateByAge || [],
						},
					],
				},
				regionalClimate: {
					...prev.regionalClimate,
					datasets: [
						{
							...prev.regionalClimate.datasets[0],
							data: csvData.regionalSwitchRate,
						},
					],
				},
				housingStatus: {
					...prev.housingStatus,
					datasets: [
						{
							...prev.housingStatus.datasets[0],
							data: csvData.housingImpact,
						},
					],
				},
				peakUsage: {
					...prev.peakUsage,
					datasets: [
						{
							...prev.peakUsage.datasets[0],
							data: csvData.peakUsagePatterns,
						},
					],
				},
				occupation: {
					...prev.occupation,
					datasets: [
						{
							...prev.occupation.datasets[0],
							data: csvData.occupationImpact,
						},
					],
				},
				stabilityPreference: {
					...prev.stabilityPreference,
					datasets: [
						{
							...prev.stabilityPreference.datasets[0],
							data: csvData.stabilityPreferenceImpact,
						},
					],
				},
			}));
		}
	}, [csvData]);

	const analysisTypes = [
		{
			title: "Age Impact Analysis",
			description:
				"Correlation between age and willingness to change energy providers",
		},
		{
			title: "Regional Climate Analysis",
			description:
				"Impact of climate zones on provider switching behavior",
		},
		{
			title: "Housing Status Analysis",
			description: "Effects of home ownership vs. renting on decisions",
		},
		{
			title: "Peak Usage Analysis",
			description: "Consumer behavior during peak vs. off-peak hours",
		},
		{
			title: "Occupation Impact",
			description:
				"Correlation between occupation and switching behavior",
		},
		{
			title: "Stability Preference Analysis",
			description: "Impact of stability preferences on provider changes",
		},
	];

	return (
		<div className="flex min-h-screen bg-gray-900">
			<Sidebar />
			<div className="flex-1 p-8 ml-64">
				<div className="max-w-7xl mx-auto">
					<div className="bg-gray-800/50 rounded-lg p-6 mb-8">
						<h1 className="text-3xl font-bold text-white mb-4">
							Simulation Results
						</h1>
						<div className="text-gray-300">
							<p className="text-lg">
								Simulation Name: {simName}
							</p>
							<p className="text-lg">
								Number of Agents: {population}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{analysisTypes.map((analysis, index) => {
							// Map analysis titles to their corresponding data
							const getDataForAnalysis = (title: string) => {
								switch (title) {
									case "Age Impact Analysis":
										return analysisData.ageImpact;
									case "Regional Climate Analysis":
										return analysisData.regionalClimate;
									case "Housing Status Analysis":
										return analysisData.housingStatus;
									case "Peak Usage Analysis":
										return analysisData.peakUsage;
									case "Occupation Impact":
										return analysisData.occupation;
									case "Stability Preference Analysis":
										return analysisData.stabilityPreference;
									default:
										return analysisData.ageImpact;
								}
							};

							return (
								<div
									key={index}
									className="bg-gray-800/50 rounded-lg p-6"
								>
									<h2 className="text-xl font-semibold mb-3 text-white">
										{analysis.title}
									</h2>
									<p className="text-gray-300 mb-4">
										{analysis.description}
									</p>
									<div className="h-48 bg-gray-700/50 rounded-lg flex items-center justify-center">
										{!loading && analysisData ? (
											<AnalysisChart
												type={analysis.title}
												data={getDataForAnalysis(
													analysis.title
												)}
											/>
										) : (
											<p className="text-gray-400">
												Loading analysis...
											</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
