"use client"
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { SimulationAgentRow } from "@/types";

interface D3AgeDistributionPlotProps {
	data: SimulationAgentRow[];
}

const D3AgeDistributionPlot: React.FC<D3AgeDistributionPlotProps> = ({
	data,
}) => {
	const ref = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (data && data.length > 0) {
			const svg = d3.select(ref.current);
			svg.selectAll("*").remove();

			const width = 500;
			const height = 300;
			const margin = { top: 20, right: 20, bottom: 80, left: 40 };

			const x = d3
				.scaleLinear()
				.domain(d3.extent(data, (d) => d.age) as [number, number])
				.range([margin.left, width - margin.right]);

			const bins = d3
				.bin()
				.value((d) => (d as any).age)
				.domain(x.domain() as [number, number])
				.thresholds(x.ticks(20))(data);

			const y = d3
				.scaleLinear()
				.domain([0, d3.max(bins, (d) => d.length) as number])
				.range([height - margin.bottom, margin.top]);

			const color = d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain([...new Set(data.map((d) => d.supplier))]);

			svg
				.append("g")
				.attr("transform", `translate(0,${height - margin.bottom})`)
				.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
                .call(g => g.append("text")
                    .attr("x", width - margin.right)
                    .attr("y", margin.bottom - 40)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text("Age"));

			svg
				.append("g")
				.attr("transform", `translate(${margin.left},0)`)
				.call(d3.axisLeft(y))
                .call(g => g.select(".domain").remove())
                .call(g => g.append("text")
                    .attr("x", -margin.left)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Count"));

            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px");

			const g = svg.append("g");

			bins.forEach((bin) => {
				const supplierCounts = new Map<string, number>();
				bin.forEach((d) => {
					supplierCounts.set(
						d.supplier,
						(supplierCounts.get(d.supplier) || 0) + 1
					);
				});

                const sortedSuppliers = [...supplierCounts.entries()].sort((a, b) => b[1] - a[1]);

				let yOffset = 0;
				for (const [supplier, count] of sortedSuppliers) {
					g.append("rect")
						.attr("x", x(bin.x0!) + 1)
						.attr("width", Math.max(0, x(bin.x1!) - x(bin.x0!) - 1))
						.attr("y", y(yOffset + count))
						.attr("height", y(yOffset) - y(yOffset + count))
						.attr("fill", color(supplier))
                        .on("mouseover", function (event, d) {
                            tooltip.transition().duration(200).style("opacity", .9);
                            tooltip.html(`Supplier: ${supplier}<br/>Age Range: ${bin.x0}-${bin.x1}<br/>Count: ${count}`)
                                .style("left", (event.pageX + 5) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d) {
                            tooltip.transition().duration(500).style("opacity", 0);
                        });
					yOffset += count;
				}
			});

            const legend = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${height - margin.bottom + 40})`);

            let legendX = 0;
            let legendY = 0;
            const legendItemHeight = 20;
            const plotWidth = width - margin.left - margin.right;

            color.domain().forEach((supplier) => {
                const legendItem = legend.append("g");

                legendItem.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 10)
                    .attr("height", 10)
                    .attr("fill", color(supplier));

                const text = legendItem.append("text")
                    .attr("x", 15)
                    .attr("y", 9)
                    .text(supplier)
                    .style("font-size", "12px")
                    .attr("alignment-baseline", "middle");

                const legendItemWidth = legendItem.node().getBBox().width + 20;

                if (legendX + legendItemWidth > plotWidth) {
                    legendX = 0;
                    legendY += legendItemHeight;
                }

                legendItem.attr("transform", `translate(${legendX}, ${legendY})`);

                legendX += legendItemWidth;
            });
		}
	}, [data]);

	return <svg ref={ref} viewBox={`0 0 500 400`} />;
};

export default D3AgeDistributionPlot;
