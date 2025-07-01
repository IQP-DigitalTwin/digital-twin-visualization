"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { SimulationAgentRow } from "@/types";

interface MapProps {
	data: SimulationAgentRow[];
}

const D3Map: React.FC<MapProps> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const [geojsonData, setGeojsonData] =
		useState<d3.GeoPermissibleObjects | null>(null);
	const [dataCounts, setDataCounts] = useState<Map<string, number> | null>(
		null
	);
	const [hoveredProperties, setHoveredProperties] = useState<any | null>(
		null
	);
	const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
		width: 800,
		height: 800,
	});

	// Resize observer to update dimensions
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				setDimensions({
					width: rect.width,
					height: rect.height,
				});
			}
		};
		handleResize();

		const resizeObserver = new window.ResizeObserver(handleResize);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}
		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		d3.json("/departements.geojson")
			.then((geoJson) => {
				setGeojsonData(geoJson as d3.GeoPermissibleObjects);
			})
			.catch((error) => {
				console.error("Error loading GeoJSON:", error);
			});
	}, []);

	useEffect(() => {
		if (!data) return;
		const counts = new Map<string, number>();
		data.forEach((row: SimulationAgentRow) => {
			const code = String(row.CP).slice(0, 2);
			if (code) {
				counts.set(code, (counts.get(code) || 0) + 1);
			}
		});
		setDataCounts(counts);
	}, [data]);

	useEffect(() => {
		const { width, height } = dimensions;
		if (!geojsonData || !dataCounts || !svgRef.current || width === 0 || height === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("g").remove();

		const projection = d3
			.geoMercator()
			.fitSize([width, height], geojsonData);

		const path = d3.geoPath().projection(projection);

		const mapGroup = svg.append("g");

		mapGroup
			.selectAll("path")
			.data((geojsonData as any).features)
			.join("path")
			.attr("d", path as any)
			.attr("fill", (d: any) => {
				const code = d.properties.code;
				const count = dataCounts.get(code) || 0;
				return d3.interpolateBlues(
					count / d3.max(Array.from(dataCounts.values()) || [1])!
				);
			})
			.attr("stroke", "#000")
			.attr("stroke-width", 0.5)
			.on("mouseover", function (event, d: any) {
				const code = d.properties.code;
				const count = dataCounts.get(code) || 0;
				setHoveredProperties({ ...d.properties, count: count });

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

		mapGroup
			.selectAll("text")
			.data((geojsonData as any).features)
			.join("text")
			.attr("transform", (d: any) => {
				const centroid = path.centroid(d);
				return `translate(${centroid[0]},${centroid[1]})`;
			})
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.style("font-size", "10px")
			.style("fill", "#333")
			.style("pointer-events", "none")
			.text((d: any) => {
				const code = d.properties.code;
				return dataCounts.get(code) || "0";
			});
	}, [geojsonData, dataCounts, dimensions]);

	useEffect(() => {
		const tooltip = d3.select(tooltipRef.current);
		if (hoveredProperties) {
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
		<div ref={containerRef} className="" style={{ position: "relative"}}>
			<svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
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
