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
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const radius = Math.min(width, height) / 2;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Tooltip div
    let tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "6px")
      .style("padding", "8px 12px")
      .style("font-size", "14px")
      .style("color", "#222")
      .style("box-shadow", "0 2px 8px rgba(0,0,0,0.12)")
      .style("visibility", "hidden");

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
      .on("mousemove", function (event, d) {
        const container = ref.current?.parentElement;
        const rect = container
          ? container.getBoundingClientRect()
          : { left: 0, top: 0 };
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.data.label}</strong>: ${d.data.value}`)
          .style("left", x + 16 + "px")
          .style("top", y - 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
      });

    g.selectAll("text")
      .data(pie)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fontSize", "14px")
      .style("fill", "#222");
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      />
      <div ref={tooltipRef} />
    </div>
  );
};
