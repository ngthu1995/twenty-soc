import { GeoMap } from "./d3Map/GeoMap";
import { TimeSeriesSeverityChart } from "./d3Map/TimeSeriesSeverityChart";
import { Box } from "@mui/material";
import { useFilters } from "../FilterContext";
import { useMemo } from "react";

type DashboardProps = {
  loading: boolean;
  error: any;
  data: any;
};

export const Dashboard = (props: DashboardProps) => {
  const { loading, error, data } = props;

  const { activeFilterColumns, selectedEvents, filteredEvents } = useFilters();

  const geoData = useMemo(() => {
    const selectedEventIds =
      selectedEvents.length === 0 ? [] : selectedEvents.map((e) => e.id);

    const convertCountry = (name: string) =>
      name === "United States" ? "USA" : name;

    const selectedCountries = new Set(
      selectedEvents.map((e: any) => convertCountry(e.source))
    );
    if (
      !activeFilterColumns.source &&
      !activeFilterColumns.eventType &&
      !activeFilterColumns.severity &&
      !activeFilterColumns.startDate &&
      !activeFilterColumns.endDate
    ) {
      const intialContriesData = (data?.topSourceCountries || []).map(
        (c: { country: string; [key: string]: any }) => ({
          ...c,
          country: convertCountry(c.country),
          selected: selectedCountries.has(convertCountry(c.country)),
        })
      );
      return {
        countriesData: intialContriesData,
        activeCountries:
          selectedEventIds.length === 0
            ? []
            : intialContriesData
                .filter((c: { selected: boolean }) => c.selected)
                .map((c: { country: string }) => c.country),
      };
    }
    if (filteredEvents.length === 0)
      return { countriesData: [], activeCountries: [] };

    const countriesData = Array.from(
      filteredEvents.reduce((map, item) => {
        const country = item?.source;
        if (country) {
          const converted = convertCountry(country);
          map.set(converted, (map.get(converted) || 0) + 1);
        }
        return map;
      }, new Map<string, number>())
    ).map(([country, count]) => ({
      country,
      count,
      selected: filteredEvents.some(
        (e) =>
          convertCountry(e.source) === country &&
          selectedEventIds.includes(e.id)
      ),
    }));
    return {
      countriesData,
      activeCountries: countriesData
        .filter((c: { selected: boolean }) => c.selected)
        .map((c: { country: string }) => c.country),
    };
  }, [data, filteredEvents, activeFilterColumns, selectedEvents]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Box sx={{ flex: 1, mb: 2, display: "flex", gap: 2 }}>
      <GeoMap
        countriesData={geoData.countriesData}
        activeCountries={geoData.activeCountries}
      />
      <TimeSeriesSeverityChart
        data={[
          {
            time: new Date("2025-04-22T00:00:00Z"),
            Critical: 2,
            High: 3,
            Medium: 1,
            Low: 1,
            Total: 7,
          },
          {
            time: new Date("2025-04-22T01:00:00Z"),
            Critical: 1,
            High: 4,
            Medium: 1,
            Low: 0,
            Total: 6,
          },
          {
            time: new Date("2025-04-22T02:00:00Z"),
            Critical: 1,
            High: 2,
            Medium: 3,
            Low: 0,
            Total: 6,
          },
        ]}
      />
    </Box>
  );
};
