import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface CountryData {
  country: string;
  count: number;
  connection_only?: boolean;
  selected?: boolean;
}

interface MapProps {
  countriesData: CountryData[];
  activeCountries: string[];
}

export const GeoMap: React.FC<MapProps> = ({
  countriesData,
  activeCountries,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [geoData, setGeoData] = useState<any | null>(null);
  const width = 800;
  const height = 500;

  // Fetch GeoJSON
  useEffect(() => {
    d3.json(
      "https://raw.githubusercontent.com/janasayantan/datageojson/master/world.json"
    ).then((data) => setGeoData(data));
  }, []);

  // Draw map when GeoJSON or data changes
  useEffect(() => {
    if (!geoData || !countriesData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous

    // Projection & path
    const projection = d3
      .geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);
    const path = d3.geoPath().projection(projection);

    // Color scale
    const maxCount = d3.max(countriesData, (d) => d.count) || 1;
    const colorScale = d3
      .scaleSequential(d3.interpolateReds)
      .domain([0, maxCount]);

    // Draw countries
    svg
      .append("g")
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const record = countriesData.find(
          (c) => c.country === d.properties.name
        );
        return record ? colorScale(record.count) : "#eee";
      })
      .attr("stroke", "#000000ff")
      .attr("stroke-width", 1)
      .style("opacity", (d: any) => {
        const name = d.properties.name.trim();

        return activeCountries.length > 0
          ? activeCountries.includes(name)
            ? 1
            : 0.3
          : 1;
      })
      .on("mouseover", function (event, d: any) {
        const record = countriesData.find(
          (c) => c.country === d.properties.name
        );
        d3.select(this).attr("stroke", "black");

        if (record) {
          const container = svgRef.current?.parentElement;
          const rect = container?.getBoundingClientRect();
          const left = event.clientX - (rect?.left || 0) + 10;
          const top = event.clientY - (rect?.top || 0) - 20;
          d3.select("#tooltip")
            .style("opacity", 1)
            .html(
              `<strong>${d.properties.name}</strong><br/>Events: ${record.count}`
            )
            .style("left", left + "px")
            .style("top", top + "px");
        }
      })
      .on("mouseout", function () {
        // d3.select(this).attr("stroke", "#999").attr("stroke-width", 0.5);
        d3.select("#tooltip").style("opacity", 0);
      });
  }, [geoData, countriesData, activeCountries, width, height]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width={width} height={height} />
      <div
        id="tooltip"
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "white",
          border: "1px solid #999",
          padding: "4px 8px",
          borderRadius: "4px",
          opacity: 0,
        }}
      />
    </div>
  );
};
