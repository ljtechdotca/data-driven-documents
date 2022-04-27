import { createAxis, createY } from "@lib/helpers";
import { Headers, PlotDimensions } from "@types";
import * as d3 from "d3";
import { scaleOrdinal } from "d3";
import { FC, useEffect, useRef } from "react";

interface BarGraphProps {
  color: string[] | readonly string[];
  data: { name: string; value: number }[];
  dimensions: PlotDimensions;
  headers: Headers;
}

export const BarGraph: FC<BarGraphProps> = ({
  color,
  data,
  dimensions,
  headers,
}) => {
  const graphRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const graph = d3.select(graphRef.current);
    graph.selectAll("*").remove();
    graph.attr("width", dimensions.width).attr("height", dimensions.height);

    const max = Math.max(...data.map((d) => d.value));
    const { margin, maxWidth, height, width, yScale } = createY(
      dimensions,
      max,
      graph
    );

    const colorScale = scaleOrdinal(
      data.map((d) => d.name),
      color
    );

    const xScale = d3
      .scaleBand()
      .padding(0.1)
      .range([0, width])
      .domain(data.map((d) => d.name));
    yScale.range([height, 0]);

    const { xAxis, yAxis, grid } = createAxis({
      headers,
      margin,
      maxWidth,
      width,
      height,
      xScale,
      yScale,
    });

    const g = graph
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    g.append("g").call(xAxis);
    g.append("g").call(yAxis);
    g.append("g").call(grid);

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name) ?? 0)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.value))
      .attr("fill", (d) => colorScale(d.name));
  }, [color, data, dimensions, headers]);

  return <svg ref={graphRef} />;
};
