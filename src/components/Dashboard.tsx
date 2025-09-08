import { GeoMap } from "./d3Map/GeoMap";
import { TimeSeriesSeverityChart } from "./d3Map/TimeSeriesSeverityChart";
import { Grid, Typography, Box } from "@mui/material";
import { useMemo } from "react";
import {
  aggregateEventsByHour,
  getSeverityPieData,
  getOtherStat,
} from "../shared/utils";
import { severityOptions, isDefaultFilterState } from "../shared/utils";

import { SeverityPieD3 } from "./d3Map/PieChart";
import { defaultFilterState, useFilters } from "../context/FilterContext";

import { StatCard } from "./StatCard";

type SecurityEvent = {
  id: string;
  source: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string;
};

type DashboardProps = {
  loading: boolean;
  error: any;
  data: any;
};

const convertCountry = (name: string) =>
  name === "United States" ? "USA" : name;

export const Dashboard = (props: DashboardProps) => {
  const { loading, error, data } = props;

  const { activeFilterColumns, selectedEvents, filteredEvents } = useFilters();

  const geoData = useMemo(() => {
    const selectedEventIds =
      selectedEvents.length === 0 ? [] : selectedEvents.map((e) => e.id);

    const selectedCountries = new Set(
      selectedEvents.map((e: any) => convertCountry(e.source))
    );

    const isFiltersDefault = isDefaultFilterState(
      activeFilterColumns,
      defaultFilterState
    );

    if (isFiltersDefault) {
      const intialContriesData = (
        data?.securityEventSummary?.topSourceCountries || []
      ).map((c: { country: string; [key: string]: any }) => ({
        ...c,
        country: convertCountry(c.country),
        selected: selectedCountries.has(convertCountry(c.country)),
      }));
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
  console.log("🚀 ~ Dashboard ~ geoData:", geoData);

  const stat = useMemo(() => {
    // Only include events with valid severity values
    // TODO: once the summary API supports filtering, we can remove this client-side filtering, and use data from API directly
    // we are not using Aggregate data file here, since the current summary is incorrect
    const filteredSecurityEvents = filteredEvents?.filter((e) =>
      severityOptions.includes(e.severity as SecurityEvent["severity"])
    ) as SecurityEvent[];

    return {
      eventTimeline:
        filteredEvents.length === 0
          ? []
          : aggregateEventsByHour(filteredSecurityEvents),
      pieData:
        filteredEvents.length === 0
          ? []
          : getSeverityPieData(filteredSecurityEvents).map((d) => ({
              ...d,
              value: d.value || 0,
            })),
      otherStat: getOtherStat(filteredEvents),
    };
  }, [data, filteredEvents]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      {stat.otherStat?.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} />
        </Grid>
      ))}

      <Grid
        size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography component="h2" variant="subtitle1" gutterBottom>
              Geographic Origins of Suspicious Traffic
            </Typography>
          </Box>
          <GeoMap
            countriesData={geoData.countriesData}
            activeCountries={geoData.activeCountries}
          />
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, sm: 3, md: 3, lg: 3 }}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography component="h2" variant="subtitle1" gutterBottom>
              Time Series Severity Chart
            </Typography>
          </Box>
          <TimeSeriesSeverityChart data={stat.eventTimeline} />
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, sm: 3, md: 3, lg: 3 }}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography component="h2" variant="subtitle1" gutterBottom>
              Severity Distribution
            </Typography>
          </Box>
          <SeverityPieD3 data={stat.pieData} />
        </Box>
      </Grid>
    </Grid>
  );
};
