"use client";
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import * as d3 from "d3";
import { SimulationAgentRow } from "@/types";

interface MapProps {
	data: SimulationAgentRow[];
    view: 'suppliers' | 'timesSwitched';
}

export interface MapRef {
    resetZoom: () => void;
}

const D3Map = forwardRef<MapRef, MapProps>(({ data, view }, ref) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const [allGeojsonData, setAllGeojsonData] = useState<{
		departements: d3.GeoPermissibleObjects | null;
		postalCodes: d3.GeoPermissibleObjects | null;
	}>({ departements: null, postalCodes: null });

	const [currentZoomK, setCurrentZoomK] = useState(1);
	
	const [hoveredProperties, setHoveredProperties] = useState<any | null>(
		null
	);
	const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
		width: 1000,
		height: 1000,
	});

    const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
    const currentTransform = useRef<d3.ZoomTransform>(d3.zoomIdentity);
    const mapGroupRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);

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
		Promise.all([
			d3.json("/departements.geojson"),
			d3.json("/correspondance-code-insee-code-postal.json").then((data: any[]) => ({
				type: "FeatureCollection",
				features: data.map(d => ({
					type: "Feature",
					geometry: d.geo_shape.geometry,
					properties: { ...d, postal_code: d.postal_code }
				}))
			}))
		])
			.then(([departementsGeoJson, postalCodesGeoJson]) => {
				setAllGeojsonData({
					departements: departementsGeoJson as d3.GeoPermissibleObjects,
					postalCodes: postalCodesGeoJson as d3.GeoPermissibleObjects,
				});
			})
			.catch((error) => {
				console.error("Error loading GeoJSON:", error);
			});
	}, []);

	useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        mapGroupRef.current = svg.append("g");

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                currentTransform.current = event.transform;
                mapGroupRef.current?.attr("transform", event.transform);
                mapGroupRef.current?.selectAll("text")
                        .style("font-size", (d: any) => `${Math.max(2, 10 / event.transform.k)}px`);
                setCurrentZoomK(event.transform.k);
            });

        svg.call(zoom as any);
        zoomRef.current = zoom;

    }, []);

	useEffect(() => {
		const { width, height } = dimensions;
		if (!allGeojsonData.departements || !allGeojsonData.postalCodes || !mapGroupRef.current || width === 0 || height === 0) return;

        

        const zoomThreshold = 3; // Adjust this value as needed
        const activeGeojsonData = currentZoomK < zoomThreshold ? allGeojsonData.departements : allGeojsonData.postalCodes;
        const isPostalCodeView = currentZoomK >= zoomThreshold;

		const projection = d3
			.geoMercator();

        const filteredGeojsonData = {
            ...activeGeojsonData,
            features: (activeGeojsonData as any).features.filter((d: any) => {
                const regionNames = d.properties.nom_region || [];
                const excludedRegions = ["MARTINIQUE", "GUADELOUPE", "REUNION", "GUYANE", "MAYOTTE"];
                return !regionNames.some((r: string) => excludedRegions.includes(r.toUpperCase()));
            })
        };

		projection.fitSize([width, height], filteredGeojsonData);

		const path = d3.geoPath().projection(projection);

        let dataMap: Map<string, Map<string, number> | number> = new Map();
        let colorScale: d3.ScaleOrdinal<string, string, never> | d3.ScaleSequential<string, never>;

        if (view === 'suppliers') {
            const supplierCounts = new Map<string, Map<string, number>>();
            data.forEach((row: SimulationAgentRow) => {
                const code = isPostalCodeView ? String(row.CP) : String(row.CP).slice(0, 2);
                if (code) {
                    if (!supplierCounts.has(code)) {
                        supplierCounts.set(code, new Map<string, number>());
                    }
                    const suppliers = supplierCounts.get(code)!;
                    suppliers.set(row.supplier, (suppliers.get(row.supplier) || 0) + 1);
                }
            });

            supplierCounts.forEach((suppliers, code) => {
                dataMap.set(code, suppliers);
            });
            colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain([...new Set(data.map(d => d.supplier))]);

        } else if (view === 'timesSwitched') {
            const timesSwitchedCounts = new Map<string, number>();
            const agentCounts = new Map<string, number>();
            data.forEach((row: SimulationAgentRow) => {
                const code = isPostalCodeView ? String(row.CP) : String(row.CP).slice(0, 2);
                if (code) {
                    timesSwitchedCounts.set(code, (timesSwitchedCounts.get(code) || 0) + row.num_times_switched);
                    agentCounts.set(code, (agentCounts.get(code) || 0) + 1);
                }
            });

            timesSwitchedCounts.forEach((total, code) => {
                const count = agentCounts.get(code) || 1;
                dataMap.set(code, total / count);
            });
            colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(Array.from(dataMap.values()).filter(d => typeof d === 'number') as number[]) || 1]);
        }

        if (view === 'suppliers') {
            const supplierCounts = new Map<string, Map<string, number>>();
            data.forEach((row: SimulationAgentRow) => {
                const code = isPostalCodeView ? String(row.CP) : String(row.CP).slice(0, 2);
                if (code) {
                    if (!supplierCounts.has(code)) {
                        supplierCounts.set(code, new Map<string, number>());
                    }
                    const suppliers = supplierCounts.get(code)!;
                    suppliers.set(row.supplier, (suppliers.get(row.supplier) || 0) + 1);
                }
            });

            supplierCounts.forEach((suppliers, code) => {
                dataMap.set(code, suppliers);
            });
            colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain([...new Set(data.map(d => d.supplier))]);

        } else if (view === 'timesSwitched') {
            const timesSwitchedCounts = new Map<string, number>();
            const agentCounts = new Map<string, number>();
            data.forEach((row: SimulationAgentRow) => {
                const code = isPostalCodeView ? String(row.CP) : String(row.CP).slice(0, 2);
                if (code) {
                    timesSwitchedCounts.set(code, (timesSwitchedCounts.get(code) || 0) + row.num_times_switched);
                    agentCounts.set(code, (agentCounts.get(code) || 0) + 1);
                }
            });

            timesSwitchedCounts.forEach((total, code) => {
                const count = agentCounts.get(code) || 1;
                dataMap.set(code, total / count);
            });
            colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(Array.from(dataMap.values()).filter(d => typeof d === 'number') as number[]) || 1]);
        }

        // Departmental Layer (always present, conditionally styled)
		mapGroupRef.current
			.selectAll(".department-path")
			.data((allGeojsonData.departements as any).features)
			.join("path")
			.attr("class", "department-path")
			.attr("d", path as any)
			.attr("fill", (d: any) => {
                if (isPostalCodeView) return "transparent";
				const code = d.properties.code;
				const value = dataMap.get(code);
                if (value === undefined) return "#ccc";

                if (view === 'suppliers') {
                    const supplierData = value as Map<string, number>;
                    let dominantSupplier = "";
                    let maxCount = 0;
                    supplierData.forEach((count, supplier) => {
                        if (count > maxCount) {
                            maxCount = count;
                            dominantSupplier = supplier;
                        }
                    });
                    return (colorScale as d3.ScaleOrdinal<string, string>)(dominantSupplier);
                } else if (typeof value === 'number') {
                    return (colorScale as d3.ScaleSequential<string>)(value);
                } else {
                    return "#ccc"; // Fallback for unexpected type
                }
			})
			.attr("stroke", "#000")
			.attr("stroke-width", 0.5)
            .style("pointer-events", isPostalCodeView ? "none" : "auto")
			.on("mouseover", function (event, d: any) {
                if (isPostalCodeView) return; // No tooltip for departments when zoomed in
				const code = d.properties.code;
				const value = dataMap.get(code);
                if (value === undefined) return; // Do not show tooltip for N/A values
				setHoveredProperties({ ...d.properties, value: value, displayCode: code, isPostalCodeView: isPostalCodeView });

				const [x, y] = d3.pointer(event, svgRef.current);
				const tooltip = d3.select(tooltipRef.current);
				tooltip
					.style("opacity", 1)
					.style("left", `${event.pageX + 10}px`)
					.style("top", `${event.pageY - 28}px`);

				d3.select(this).attr("fill", "#ffbe88").attr("stroke-width", 1);
			})
			.on("mouseout", function () {
                if (isPostalCodeView) return; // No tooltip for departments when zoomed in
				setHoveredProperties(null);

				d3.select(tooltipRef.current).style("opacity", 0);

				d3.select(this)
					.attr("fill", (d: any) => {
						const code = d.properties.code;
						const value = dataMap.get(code);
                        if (value === undefined) return "#ccc";
                        if (view === 'suppliers') {
                            const supplierData = value as Map<string, number>;
                            let dominantSupplier = "";
                            let maxCount = 0;
                            supplierData.forEach((count, supplier) => {
                                if (count > maxCount) {
                                    maxCount = count;
                                    dominantSupplier = supplier;
                                }
                            });
                            return (colorScale as d3.ScaleOrdinal<string, string>)(dominantSupplier);
                        } else if (typeof value === 'number') {
                            return (colorScale as d3.ScaleSequential<string>)(value);
                        } else {
                            return "#ccc"; // Fallback for unexpected type
                        }
					});
			});

        // Postal Code Layer (conditionally rendered)
		mapGroupRef.current
			.selectAll(".postal-code-path")
			.data(isPostalCodeView ? (allGeojsonData.postalCodes as any).features.filter((d: any) => dataMap.has(d.properties.postal_code)) : [])
			.join("path")
			.attr("class", "postal-code-path")
			.attr("d", path as any)
			.attr("fill", (d: any) => {
				const code = d.properties.postal_code;
				const value = dataMap.get(code);
                if (value === undefined) return "#ccc";

                if (view === 'suppliers') {
                    const supplierData = value as Map<string, number>;
                    let dominantSupplier = "";
                    let maxCount = 0;
                    supplierData.forEach((count, supplier) => {
                        if (count > maxCount) {
                            maxCount = count;
                            dominantSupplier = supplier;
                        }
                    });
                    return (colorScale as d3.ScaleOrdinal<string, string>)(dominantSupplier);
                } else if (typeof value === 'number') {
                    return (colorScale as d3.ScaleSequential<string>)(value);
                } else {
                    return "#ccc"; // Fallback for unexpected type
                }
			})
			.attr("stroke", "#000")
			.attr("stroke-width", 0.5)
			.on("mouseover", function (event, d: any) {
				const code = d.properties.postal_code;
				const value = dataMap.get(code);
                if (value === undefined) return; // Do not show tooltip for N/A values
				setHoveredProperties({ ...d.properties, value: value, displayCode: code, isPostalCodeView: isPostalCodeView });

				const [x, y] = d3.pointer(event, svgRef.current);
				const tooltip = d3.select(tooltipRef.current);
				tooltip
					.style("opacity", 1)
					.style("left", `${event.pageX + 10}px`)
					.style("top", `${event.pageY - 28}px`);

				d3.select(this).attr("fill", "#ffbe88").attr("stroke-width", 1);
			})
			.on("mouseout", function () {
				setHoveredProperties(null);

				d3.select(tooltipRef.current).style("opacity", 0);

				d3.select(this)
					.attr("fill", (d: any) => {
						const code = d.properties.postal_code;
						const value = dataMap.get(code);
                        if (value === undefined) return "#ccc";
                        if (view === 'suppliers') {
                            const supplierData = value as Map<string, number>;
                            let dominantSupplier = "";
                            let maxCount = 0;
                            supplierData.forEach((count, supplier) => {
                                if (count > maxCount) {
                                    maxCount = count;
                                    dominantSupplier = supplier;
                                }
                            });
                            return (colorScale as d3.ScaleOrdinal<string, string>)(dominantSupplier);
                        } else if (typeof value === 'number') {
                            return (colorScale as d3.ScaleSequential<string>)(value);
                        } else {
                            return "#ccc"; // Fallback for unexpected type
                        }
					});
			});

        // Departmental Text (conditionally rendered)
		mapGroupRef.current
			.selectAll(".department-text")
			.data(isPostalCodeView ? [] : (allGeojsonData.departements as any).features.filter((d: any) => dataMap.has(d.properties.code)))
			.join("text")
			.attr("class", "department-text")
			.attr("transform", (d: any) => {
				const centroid = path.centroid(d);
				return `translate(${centroid[0]},${centroid[1]})`;
			})
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.style("font-size", (d: any) => `${Math.max(2, 10 / currentTransform.current.k)}px`)
			.style("fill", "#333")
			.style("pointer-events", "none")
			.text((d: any) => {
				const code = d.properties.code;
				const value = dataMap.get(code);
                if (view === 'suppliers') {
                    if (value instanceof Map) {
                        const supplierData = value as Map<string, number>;
                        let dominantSupplier = "";
                        let maxCount = 0;
                        supplierData.forEach((count, supplier) => {
                            if (count > maxCount) {
                                maxCount = count;
                                dominantSupplier = supplier;
                            }
                        });
                        return dominantSupplier;
                    } else {
                        return ""; // Fallback if value is not a Map for suppliers view
                    }
                } else if (typeof value === 'number') {
                    return value.toFixed(2);
                } else {
                    return ""; // Fallback for unexpected type
                }
			});

        // Postal Code Text (conditionally rendered)
		mapGroupRef.current
			.selectAll(".postal-code-text")
			.data(isPostalCodeView ? (allGeojsonData.postalCodes as any).features.filter((d: any) => dataMap.has(d.properties.postal_code)) : [])
			.join("text")
			.attr("class", "postal-code-text")
			.attr("transform", (d: any) => {
				const centroid = path.centroid(d);
				return `translate(${centroid[0]},${centroid[1]})`;
			})
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "middle")
			.style("font-size", (d: any) => `${Math.max(2, 10 / currentTransform.current.k)}px`)
			.style("fill", "#333")
			.style("pointer-events", "none")
			.text((d: any) => {
				const code = d.properties.postal_code;
				const value = dataMap.get(code);
                if (view === 'suppliers') {
                    if (value instanceof Map) {
                        const supplierData = value as Map<string, number>;
                        let dominantSupplier = "";
                        let maxCount = 0;
                        supplierData.forEach((count, supplier) => {
                            if (count > maxCount) {
                                maxCount = count;
                                dominantSupplier = supplier;
                            }
                        });
                        return dominantSupplier;
                    } else {
                        return ""; // Fallback if value is not a Map for suppliers view
                    }
                } else if (typeof value === 'number') {
                    return value.toFixed(2);
                } else {
                    return ""; // Fallback for unexpected type
                }
			});
        
			}, [allGeojsonData, data, dimensions, view, currentZoomK]);

    useImperativeHandle(ref, () => ({
        resetZoom: () => {
            if (svgRef.current && zoomRef.current) {
                d3.select(svgRef.current).transition().duration(750).call(zoomRef.current.transform as any, d3.zoomIdentity);
            }
        },
    }));

	useEffect(() => {
		const tooltip = d3.select(tooltipRef.current);
		if (hoveredProperties) {
			let tooltipContent = `<strong>Code:</strong> ${hoveredProperties.displayCode}<br/>`;
            if (hoveredProperties.nom_comm) {
                tooltipContent += `<strong>Commune:</strong> ${hoveredProperties.nom_comm}<br/>`;
            }
            if (hoveredProperties.nom_dept && hoveredProperties.nom_dept.length > 0) {
                tooltipContent += `<strong>Department:</strong> ${hoveredProperties.nom_dept.join(', ')}<br/>`;
            }

            if (view === 'suppliers') {
                const supplierData = hoveredProperties.value;
                if (supplierData instanceof Map) {
                    const sortedSuppliers = Array.from(supplierData.entries()).sort((a, b) => b[1] - a[1]);
                    if (hoveredProperties.isPostalCodeView) {
                        // Postal code view: show only the top supplier
                        if (sortedSuppliers.length > 0) {
                            tooltipContent += `<strong>Supplier:</strong> ${sortedSuppliers[0][0]} (${sortedSuppliers[0][1]} agents)<br/>`;
                        }
                    } else {
                        // Department view: show top 3 suppliers
                        tooltipContent += `<strong>Top Suppliers:</strong><br/>`;
                        sortedSuppliers.slice(0, 3).forEach(([supplier, count]) => {
                            tooltipContent += `&nbsp;&nbsp;${supplier}: ${count} agents<br/>`;
                        });
                    }
                }
            } else if (view === 'timesSwitched' && hoveredProperties.value !== undefined) {
                tooltipContent += `<strong>Avg. Times Switched:</strong> ${hoveredProperties.value.toFixed(2)}<br/>`;
            }
			tooltip.html(tooltipContent);
		} else {
			tooltip.html("");
		}
	}, [hoveredProperties, view]);

	return (
		<div ref={containerRef} className="flex grow w-full h-full">
			<svg ref={svgRef} className="w-full h-full"></svg>
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
});

export default D3Map;
