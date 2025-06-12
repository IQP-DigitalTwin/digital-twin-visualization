"use client"
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface MapProps {
	width: number;
	height: number;
}

const D3Map: React.FC<MapProps> = ({ width, height }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const [geojsonData, setGeojsonData] =
		useState<d3.GeoPermissibleObjects | null>(null);
	const [dataCounts, setDataCounts] = useState<Map<string, number> | null>(
		null
	); // Map to store code -> count
	const [hoveredProperties, setHoveredProperties] = useState<any | null>(
		null
	);

	useEffect(() => {
		// Load GeoJSON and CSV data concurrently
		Promise.all([
			d3.json("/departements.geojson"), // Path to your GeoJSON
			d3.csv("/populations/test.csv"), // Path to your CSV
		])
			.then(([geoJson, csvData]) => {
				setGeojsonData(geoJson as d3.GeoPermissibleObjects);

				// Process CSV data to get counts
				const counts = new Map<string, number>();
				csvData.forEach((row: any) => {
					const code = row.CP.slice(0,2); // Assuming your CSV has a 'code' column
					if (code && row.time == 0) {
						counts.set(code, (counts.get(code) || 0) + 1);
					}
				});
				setDataCounts(counts);
			})
			.catch((error) => {
				console.error("Error loading data:", error);
			});
	}, []);

	useEffect(() => {
		if (!geojsonData || !dataCounts || !svgRef.current) return;

		const svg = d3.select(svgRef.current);

		// Clear any existing elements before drawing
		svg.selectAll("g").remove();

		// Define projection
		const projection = d3
			.geoMercator()
			.fitSize([width, height], geojsonData);

		// Define path generator
		const path = d3.geoPath().projection(projection);

		// Group for map features and labels
		const mapGroup = svg.append("g");

		// Draw map features
		mapGroup
			.selectAll("path")
			.data(geojsonData.features)
			.join("path")
			.attr("d", path as any)
			.attr("fill", (d: any) => {
				const code = d.properties.code;
				const count = dataCounts.get(code) || 0;
				// Simple color scale: darker for higher count
				return d3.interpolateBlues(
					count / d3.max(Array.from(dataCounts.values()) || [1])!
				);
			})
			.attr("stroke", "#000")
			.attr("stroke-width", 0.5)
			.on("mouseover", function (event, d: any) {
				const code = d.properties.code;
				const count = dataCounts.get(code) || 0;
				setHoveredProperties({ ...d.properties, count: count }); // Add count to properties

				const [x, y] = d3.pointer(event, svgRef.current);
				const tooltip = d3.select(tooltipRef.current);
				tooltip
					.style("opacity", 1)
					.style("left", `${x + 10}px`)
					.style("top", `${y + 10}px`);

				d3.select(this).attr("fill", "#ffbe88").attr("stroke-width", 1);
			})
			.on("mouseout", function () {
				setHoveredProperties(null);

				d3.select(tooltipRef.current).style("opacity", 0);

				// Revert fill based on count
				d3.select(this)
					.attr("fill", (d: any) => {
						const code = d.properties.code;
						const count = dataCounts.get(code) || 0;
						return d3.interpolateBlues(
							count /
								d3.max(Array.from(dataCounts.values()) || [1])!
						);
					})
					.attr("stroke-width", 1);
			});

		// Add text labels for counts
		mapGroup
			.selectAll("text")
			.data(geojsonData.features)
			.join("text")
			.attr("transform", (d: any) => {
				// Calculate centroid of the polygon for text positioning
				const centroid = path.centroid(d);
				return `translate(${centroid[0]},${centroid[1]})`;
			})
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.style("font-size", "10px")
			.style("fill", "#333")
			.style("pointer-events", "none") // Important: allow mouse events to pass through to the polygon
			.text((d: any) => {
				const code = d.properties.code;
				return dataCounts.get(code) || "0"; // Display the count
			});
	}, [geojsonData, dataCounts, width, height]);

	// Effect to update tooltip content when hoveredProperties changes
	useEffect(() => {
		const tooltip = d3.select(tooltipRef.current);
		if (hoveredProperties) {
			// Create a more readable display for the tooltip
			let tooltipContent = "<strong>Properties:</strong><br/>";
			for (const key in hoveredProperties) {
				if (
					Object.prototype.hasOwnProperty.call(hoveredProperties, key)
				) {
					tooltipContent += `<strong>${key}:</strong> ${hoveredProperties[key]}<br/>`;
				}
			}
			tooltip.html(tooltipContent);
		} else {
			tooltip.html("");
		}
	}, [hoveredProperties]);

	return (
		<div style={{ position: "relative" }}>
			<svg ref={svgRef} width={width} height={height}></svg>
			<div
				ref={tooltipRef}
				style={{
					position: "absolute",
					opacity: 0,
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					border: "1px solid #ccc",
					padding: "8px",
					pointerEvents: "none",
					borderRadius: "4px",
					boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
					fontSize: "12px",
					lineHeight: "1.4",
					maxHeight: "200px",
					overflowY: "auto",
					zIndex: 1000,
				}}
			>
				{/* Content will be set by D3 */}
			</div>
		</div>
	);
};

export default D3Map;
