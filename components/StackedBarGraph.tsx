import { createAxis, createY } from "@lib/helpers";
import { Dimensions, Headers } from "@types";
import * as d3 from "d3";
import { ScaleOrdinal, select } from "d3";
import { FC, useEffect, useRef } from "react";

interface StackedBarGraphProps {
  color: ScaleOrdinal<string, string, never>;
  data: Record<string, any>[];
  dimensions: Dimensions;
  headers: Headers;
  keys: string[]
}

export const StackedBarGraph: FC<StackedBarGraphProps> = ({
  color,
  data,
  dimensions,
  headers,
  keys
}) => {
  const graphRef = useRef<SVGSVGElement>(null);
  const legendRef= useRef<SVGSVGElement>(null);

  useEffect(() => {
    // build legend
    const legend = select(legendRef.current);
    legend.selectAll("*").remove();
    legend.attr("width", dimensions.width).attr("height", keys.length * 32);
    legend
      .selectAll()
      .data(keys)
      .enter()
      .append("rect")
      .attr("height", 32)
      .attr("width", 32)
      .attr("y", (d, i) => 32 * i)
      .attr("class", "legend__color")
      .attr("fill", (d) => color(d));
    legend
      .selectAll()
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 40)
      .attr("y", (d, i) => 32 * i + 23)
      .attr("class", "legend__label")
      .text((d) => d);

    // build graph
    const graph = d3.select(graphRef.current);
    graph.selectAll("*").remove();
    graph
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewbox", [0, 0, dimensions.width, dimensions.height]);

    const stack = d3.stack().keys(keys).order(d3.stackOrderReverse)(
      data
    );

    const values = Object.values(stack[0]);
    const valuesMapD1 = values.map((d) => (d[1] ? d[1] : 0));
    const max = Math.max(...valuesMapD1);

    const { margin, maxWidth, height, width, yScale } = createY(
      dimensions,
      max,
      graph
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

    const group = g
      .selectAll()
      .data(stack)
      .enter()
      .append("g")
      .attr("fill", (d) => String(color(d.key)));
    group
      .selectAll(".bar")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(String(d.data.name)) ?? 0)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", (d) => xScale.bandwidth())
      .attr("height", (d) => height - yScale(d[1]));
  }, [color, data, dimensions, headers]);

  return (
    <>
      <svg ref={legendRef} />
      <svg ref={graphRef} />
    </>
  );
};
