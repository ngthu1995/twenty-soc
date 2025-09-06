import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type DataPoint = {
  time: Date;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
  Total: number;
};

type Props = {
  data: DataPoint[];
  width?: number;
  height?: number;
};

export const TimeSeriesSeverityChart: React.FC<Props> = ({
  data,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 40, right: 100, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale (time)
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.time) as [Date, Date])
      .range([0, innerWidth]);

    // Y scale (count)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Total)!])
      .nice()
      .range([innerHeight, 0]);

    // Color scale for severity
    const color = d3
      .scaleOrdinal<string>()
      .domain(["Total", "Critical", "High", "Medium", "Low"])
      .range(["#000000", "#d32f2f", "#f57c00", "#1976d2", "#388e3c"]);

    // Define series
    const series = [
      { key: "Total", label: "Total Events" },
      { key: "Critical", label: "Critical" },
      { key: "High", label: "High" },
      { key: "Medium", label: "Medium" },
      { key: "Low", label: "Low" },
    ] as const;

    // Draw lines
    series.forEach((s) => {
      if (data.length === 1) {
        const xPos = x(data[0].time);
        const yPos = y(data[0][s.key]);
        // Only draw if value > 0
        if (data[0][s.key] > 0) {
          // Draw horizontal line from axis (y=0) to the point
          g.append("line")
            .attr("x1", x(x.domain()[0]))
            .attr("x2", xPos)
            .attr("y1", y.domain()[0])
            .attr("y2", yPos)
            .attr("stroke", color(s.key) as string)
            .attr("stroke-width", s.key === "Total" ? 3 : 2);

          // Draw dot at the data point
          g.append("circle")
            .attr("cx", xPos)
            .attr("cy", yPos)
            .attr("r", 5)
            .attr("fill", color(s.key) as string);
        }
      } else {
        // Draw the line for multiple points
        const lineGen = d3
          .line<DataPoint>()
          .x((d) => x(d.time))
          .y((d) => y(d[s.key]));

        g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", color(s.key) as string)
          .attr("stroke-width", s.key === "Total" ? 3 : 2)
          .attr("d", lineGen);
      }
    });

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M") as any));

    // Y axis
    g.append("g").call(d3.axisLeft(y));

    // Axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 35)
      .attr("text-anchor", "middle")
      .text("Time");

    g.append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Event Count");
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Severity legend below chart
  const legendItems = [
    { key: "Total", label: "Total Events", color: "#000000" },
    { key: "Critical", label: "Critical", color: "#d32f2f" },
    { key: "High", label: "High", color: "#f57c00" },
    { key: "Medium", label: "Medium", color: "#1976d2" },
    { key: "Low", label: "Low", color: "#388e3c" },
  ];

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginTop: 16,
        }}
      >
        {legendItems.map((item) => (
          <div
            key={item.key}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                background: item.color,
                display: "inline-block",
                borderRadius: 3,
                marginRight: 4,
              }}
            />
            <span style={{ fontSize: 14 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
