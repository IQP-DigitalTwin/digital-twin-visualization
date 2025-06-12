import { useState, useEffect } from "react";
import Papa from "papaparse";

interface ParsedData {
	switchRateByAge: number[];
	regionalSwitchRate: number[];
	housingImpact: number[];
	peakUsagePatterns: number[];
	occupationImpact: number[];
	stabilityPreferenceImpact: number[];
}

export function useCsvData(filePath: string) {
	const [data, setData] = useState<ParsedData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(filePath);
				const csvText = await response.text();

				Papa.parse(csvText, {
					header: true,
					complete: (results) => {
						const parsedData: ParsedData = {
							switchRateByAge: results.data.map(
								(row: any) =>
									parseFloat(row.switchRateByAge) || 0
							),
							regionalSwitchRate: results.data.map(
								(row: any) =>
									parseFloat(row.regionalSwitchRate) || 0
							),
							housingImpact: results.data.map(
								(row: any) => parseFloat(row.housingImpact) || 0
							),
							peakUsagePatterns: results.data.map(
								(row: any) =>
									parseFloat(row.peakUsagePatterns) || 0
							),
							occupationImpact: results.data.map(
								(row: any) =>
									parseFloat(row.occupationImpact) || 0
							),
							stabilityPreferenceImpact: results.data.map(
								(row: any) =>
									parseFloat(row.stabilityPreferenceImpact) ||
									0
							),
						};
						setData(parsedData);
						setLoading(false);
					},
					error: (error: Error) => {
						console.error("Error parsing CSV:", error);
						setLoading(false);
					},
				});
			} catch (error: unknown) {
				console.error("Error fetching CSV:", error);
				setLoading(false);
			}
		};

		fetchData();
	}, [filePath]);

	return { data, loading };
}
