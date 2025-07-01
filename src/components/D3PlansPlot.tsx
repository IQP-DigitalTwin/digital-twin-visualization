"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { SimulationPlanRow } from "@/types";

interface D3PlansPlotProps {
    data: SimulationPlanRow[];
    columns: string[];
    width?: number;
    height?: number;
}

const COLORS = d3.schemeCategory10;

const D3PlansPlot: React.FC<D3PlansPlotProps> = ({
    data,
    columns,
    width = 800,
    height = 400,
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Responsive dimensions
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width,
        height,
    });

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

    // Find the columns we care about
    const s_EDF_p_TRV = columns.find(col => col === "s_EDF_p_TRV");
    const s_EDF = columns.find(col => col === "s_EDF");
    // All other s_<SUPPLIER> columns except s_EDF
    const otherSuppliers = columns.filter(
        col => /^s_[^_]+$/.test(col) && col !== "s_EDF"
    );

    // Prepare the data series
    const series: { key: string; label: string; values: number[] }[] = [];

    if (s_EDF_p_TRV && s_EDF) {
        // s_EDF_p_TRV
        series.push({
            key: "s_EDF_p_TRV",
            label: "EDF TRV",
            values: data.map(d => d[s_EDF_p_TRV] ?? 0),
        });
        // s_EDF - s_EDF_p_TRV
        series.push({
            key: "s_EDF_minus_TRV",
            label: "EDF (other plans)",
            values: data.map(d => (d[s_EDF] ?? 0) - (d[s_EDF_p_TRV] ?? 0)),
        });
    }
    // Add other suppliers
    otherSuppliers.forEach((col, idx) => {
        series.push({
            key: col,
            label: col.replace(/^s_/, ""), // e.g. "s_ENGIE" -> "ENGIE"
            values: data.map(d => d[col] ?? 0),
        });
    });

    useEffect(() => {
        if (!data.length || !series.length || !svgRef.current) return;

        const width = dimensions.width || 800;
        const height = dimensions.height || 400;
        const margin = { top: 30, right: 30, bottom: 40, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // X scale (time)
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, d => d.time) as [number, number])
            .range([0, innerWidth]);

        // Y scale (plan values)
        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(series.map(s => d3.max(s.values) || 0)) || 1,
            ])
            .nice()
            .range([innerHeight, 0]);

        // X axis
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).ticks(8));

        // Y axis
        g.append("g").call(d3.axisLeft(y));

        // Line generator
        const line = d3
            .line<[number, number]>()
            .x(d => x(d[0]))
            .y(d => y(d[1]));

        // Draw lines for each series
        series.forEach((s, idx) => {
            const lineData = data.map((d, i) => [d.time, s.values[i]] as [number, number]);
            // Draw a thick transparent path for easier mouseover
            g.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", "transparent")
                .attr("stroke-width", 18) // Large invisible stroke for mouse events
                .attr("d", line as any)
                .attr("cursor", "pointer")
                .on("mousemove", function (event) {
                    // Find closest point
                    const [mx] = d3.pointer(event, this);
                    const x0 = x.invert(mx);
                    // Find the closest index
                    let closestIdx = 0;
                    let minDiff = Infinity;
                    for (let i = 0; i < data.length; i++) {
                        const diff = Math.abs(data[i].time - x0);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestIdx = i;
                        }
                    }
                    const dPoint = data[closestIdx];
                    const value = s.values[closestIdx];
                    const tooltip = tooltipRef.current;
                    if (tooltip) {
                        tooltip.style.opacity = "1";
                        tooltip.style.left = `${event.clientX + 15}px`;
                        tooltip.style.top = `${event.clientY - 10}px`;
                        tooltip.innerHTML = `<strong>${s.label}</strong><br/>Time: ${dPoint.time}<br/>Value: ${value}`;
                    }
                })
                .on("mouseleave", function () {
                    const tooltip = tooltipRef.current;
                    if (tooltip) {
                        tooltip.style.opacity = "0";
                    }
                });

            // Draw the visible line on top
            g.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", COLORS[idx % COLORS.length])
                .attr("stroke-width", 4) // Thicker visible line
                .attr("d", line as any);

            // Add legend
            g.append("text")
                .attr("x", innerWidth - 120)
                .attr("y", 20 + idx * 20)
                .attr("fill", COLORS[idx % COLORS.length])
                .style("font-size", "14px")
                .text(s.label);
        });

        // Axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Time");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 18)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Number of Households");
    }, [data, series, dimensions]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-center"
            style={{ position: "relative" }}
        >
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
            <div
                ref={tooltipRef}
                style={{
                    position: "fixed",
                    pointerEvents: "none",
                    opacity: 0,
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px",
                    fontSize: "13px",
                    color: "#222",
                    zIndex: 1000,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    minWidth: "120px",
                    maxWidth: "250px",
                }}
            />
        </div>
    );
};

export default D3PlansPlot;