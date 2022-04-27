import { createAxis, createY } from "@lib/helpers";
import { Headers, PlotDimensions } from "@types";
import { scaleLinear, scaleOrdinal, select, symbol, symbols } from "d3";
import { FC, useEffect, useRef } from "react";

interface ScatterPlotProps {
  color: string[] | readonly string[];
  data: {
    category: string;
    x: number;
    y: number;
  }[];
  dimensions: PlotDimensions;
  headers: Headers;
}

export const ScatterPlot: FC<ScatterPlotProps> = ({
  color,
  data,
  dimensions,
  headers,
}) => {
  const graphRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const graph = select(graphRef.current);
    graph.selectAll("*").remove();
    graph
      .attr("height", dimensions.height)
      .attr("width", dimensions.width)
      .attr("viewbox", [0, 0, dimensions.width, dimensions.height]);

    const [minX, maxX] = [
      Math.min(...data.map((d) => d.x)),
      Math.max(...data.map((d) => d.x)),
    ];
    const [minY, maxY] = [
      Math.min(...data.map((d) => d.y)),
      Math.max(...data.map((d) => d.y)),
    ];
    const { margin, maxWidth, height, width, yScale } = createY(
      dimensions,
      maxY,
      graph
    );

    const colorScale = scaleOrdinal(
      data.map((d) => d.category),
      color
    );
    const shape = scaleOrdinal(
      data.map((d) => d.category),
      symbols.map((s) => symbol().type(s)())
    );
    const xScale = scaleLinear().domain([minX, maxX]).range([0, width]);
    yScale.domain([minY, maxY]).range([height, 0]);

    const { xAxis, yAxis, grid } = createAxis({
      headers,
      height,
      margin,
      maxWidth,
      width,
      xScale,
      yScale,
    });

    const g = graph
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    g.append("g").call(xAxis);
    g.append("g").call(yAxis);
    g.append("g").call(grid);

    g.append("g")
      .attr("stroke-width", 1.5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("transform", (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .attr("fill", (d) => colorScale(d.category))
      .attr("d", (d) => String(shape(d.category)));
  }, []);

  return <svg ref={graphRef} />;
};
