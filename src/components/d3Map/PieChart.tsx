import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export type SeverityDatum = {
  label: string;
  value: number;
  color: string;
};

export interface SeverityPieD3Props {
  data: SeverityDatum[];
  width?: number;
  height?: number;
}

export const SeverityPieD3: React.FC<SeverityPieD3Props> = ({
  data,
  width = 300,
  height = 300,
}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const radius = Math.min(width, height) / 2;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
    const pie = d3.pie<SeverityDatum>().value((d) => d.value)(data);
    const arc = d3
      .arc<d3.PieArcDatum<SeverityDatum>>()
      .innerRadius(0)
      .outerRadius(radius);

    g.selectAll("path")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    g.selectAll("text")
      .data(pie)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fontSize", "14px")
      .style("fill", "#222")
      .text((d) => d.data.label);
  }, [data, width, height]);

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
    />
  );
};
