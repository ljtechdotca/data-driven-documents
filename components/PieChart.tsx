import { PieDimensions } from "@types";
import * as d3 from "d3";
import { FC, useEffect, useRef } from "react";

interface PieChartProps {
  color: string[] | readonly string[];
  data: {
    name: string;
    value: number;
  }[];
  dimensions: PieDimensions;
}

export const PieChart: FC<PieChartProps> = ({ color, data, dimensions }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const margin = {
      top: dimensions.margin[0],
      right: dimensions.margin[1],
      bottom: dimensions.margin[2],
      left: dimensions.margin[3],
    };

    const width = 2 * dimensions.outerRadius + margin.left + margin.right;
    const height = 2 * dimensions.outerRadius + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const colorScale = d3.scaleOrdinal(
      data.map((item) => item.name),
      color
    );

    const arcGenerator = d3
      .arc()
      .innerRadius(dimensions.innerRadius)
      .outerRadius(dimensions.outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => (d as any).value);

    const arc = g
      .selectAll()
      .data(pieGenerator(data as any))
      .enter();

    arc
      .append("path")
      .attr("d", arcGenerator as any)
      .style("fill", (d) => colorScale((d as any).data.name))
      .style("stroke", "#ffffff")
      .style("stroke-width", 0);

    arc
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text((d) => (d.data as any).name)
      .attr("transform", (d) => {
        const [x, y] = arcGenerator.centroid(d as any);
        const translate = `translate(${x}, ${y})`;
        return translate;
      })
      .style("fill", "white");
  });

  return <svg ref={svgRef} />;
};
