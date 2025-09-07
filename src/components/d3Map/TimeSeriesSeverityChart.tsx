import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { severityColors } from "../../shared/utils";

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
  width = 300,
  height = 300,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length) return;

    const margin = { top: 20, right: 70, bottom: 40, left: 40 };
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
      .domain(Object.keys(severityColors).concat("Total"))
      .range(Object.values(severityColors).concat("#000000"));

    // Define series
    const series = [
      { key: "Total", label: "Total" },
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
    // Set ticks to every hour
    const xDomain = x.domain();
    let hourTicks: Date[] = [];
    if (
      xDomain &&
      xDomain[0] instanceof Date &&
      xDomain[1] instanceof Date &&
      xDomain[0] !== null &&
      xDomain[1] !== null
    ) {
      hourTicks = d3.timeHour.every(1)!.range(xDomain[0], xDomain[1]);
      // Ensure last tick is included
      const lastTick = hourTicks[hourTicks.length - 1];
      const endTime = xDomain[1];
      if (
        lastTick instanceof Date &&
        endTime instanceof Date &&
        !isNaN(lastTick.getTime()) &&
        !isNaN(endTime.getTime()) &&
        lastTick.getTime() < endTime.getTime()
      ) {
        hourTicks.push(
          new Date(
            endTime.getFullYear(),
            endTime.getMonth(),
            endTime.getDate(),
            endTime.getHours(),
            0,
            0,
            0
          )
        );
      }
    }
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.max(hourTicks.length, 8))
          .tickValues(hourTicks)
          .tickFormat(d3.timeFormat("%H:%M") as any)
      );

    // Y axis
    const maxY = d3.max(data, (d) => d.Total) ?? 1;
    g.append("g").call(
      d3
        .axisLeft(y)
        .ticks(Math.ceil(maxY))
        .tickFormat((domainValue, _i) => {
          const n =
            typeof domainValue === "number"
              ? domainValue
              : Number(domainValue.valueOf());
          return Number.isInteger(n) ? n.toString() : "";
        })
    );

    // Axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 35)
      .attr("text-anchor", "middle")
      .text("Time");

    g.append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", -20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Event Count");
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Severity legend below chart
  const legendKeys = ["Total", ...Object.keys(severityColors)];
  const legendItems = legendKeys.map((key) => ({
    key,
    label: key,
    color: (severityColors[key] as string) || "#000000",
  }));

  return (
    <div style={{}}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 12,
          marginBottom: 4,
          fontSize: 12,
        }}
      >
        {legendItems.map((item) => (
          <div
            key={item.key}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                background: item.color,
                display: "inline-block",
                borderRadius: 2,
                marginRight: 2,
              }}
            />
            <span style={{ fontSize: 12 }}>{item.label}</span>
          </div>
        ))}
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      ></svg>
    </div>
  );
};
