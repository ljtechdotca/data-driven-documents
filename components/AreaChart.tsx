import { Headers, PlotDimensions } from "@types";
import * as d3 from "d3";
import { FC, useEffect, useRef } from "react";

interface AreaChartProps {
  color: string;
  data: {
    date: string;
    value: number;
  }[];
  dimensions: PlotDimensions;
  headers: Headers;
}

export const AreaChart: FC<AreaChartProps> = ({
  color,
  data,
  dimensions,
  headers,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const parseTime = d3.timeParse("%Y-%m-%d");
    const parsedData = data.map((d) => ({
      date: parseTime(d.date as string) as Date,
      value: Number(d.value) || 0,
    }));

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...data.map((d) => d.value))])
      .range([100, 0])
      .nice();

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    const falseYAxis = svg.append("g").call(d3.axisLeft(yScale));
    let maxWidth = 0;
    falseYAxis.selectAll(".tick>text").each(function (d) {
      const boxWidth = (this as SVGTextElement).getBBox().width;
      if (boxWidth > maxWidth) maxWidth = boxWidth;
    });
    falseYAxis.remove();

    const margin = {
      top: dimensions.margin[0],
      right: dimensions.margin[1],
      bottom: dimensions.margin[2],
      left: maxWidth + dimensions.margin[3],
    };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.bottom - margin.top;

    const xScale = d3
      .scaleTime()
      .domain([parsedData[0].date, parsedData[parsedData.length - 1].date])
      .range([0, width]);
    yScale.range([height, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.right})`);

    g.append("path")
      .datum(parsedData)
      .attr("fill", color)
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .area()
          .x((d: any) => xScale(d.date))
          .y0(yScale(0))
          .y1((d: any) => yScale(d.value)) as any
      );

    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .append("g")
        .attr("class", "axis axis__x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .call((g) =>
          g
            .append("text")
            .attr("x", width / 2)
            .attr("y", 32)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .text(headers.x)
        );

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .append("g")
        .attr("class", "axis axis__y")
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisLeft(yScale))
        .call((g) =>
          g
            .append("text")
            .attr("x", -maxWidth - 16)
            .attr("y", height / 2)
            .attr("writing-mode", "vertical-lr")
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .text(headers.y)
        );

    g.append("g").call(xAxis);
    g.append("g").call(yAxis);
  });

  return <svg ref={svgRef} />;
};
