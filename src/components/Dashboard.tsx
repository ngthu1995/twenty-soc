import { GeoMap } from "./d3Map/GeoMap";
import { TimeSeriesSeverityChart } from "./d3Map/TimeSeriesSeverityChart";
import { Grid, Typography, Box } from "@mui/material";
import { useFilters } from "../FilterContext";
import { useMemo } from "react";
import {
  aggregateEventsByHour,
  getSeverityPieData,
  getOtherStat,
} from "../utils";
import { severityOptions } from "../utils";

import { SeverityPieD3, SeverityDatum } from "./d3Map/PieChart";
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
  const { source, eventType, severity, startDate, endDate } =
    activeFilterColumns;

  const geoData = useMemo(() => {
    const selectedEventIds =
      selectedEvents.length === 0 ? [] : selectedEvents.map((e) => e.id);

    const selectedCountries = new Set(
      selectedEvents.map((e: any) => convertCountry(e.source))
    );
    if (!source && !eventType && !severity && !startDate && !endDate) {
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

  const stat = useMemo(() => {
    // Only include events with valid severity values
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

  const statData = useMemo(() => {
    if (filteredEvents.length === 0)
      return [
        {
          title: "Total Users Affected",
          value: 0,
        },
        {
          title: "Total Events",
          value: 0,
        },
        {
          title: "Total Countries Affected",
          value: 0,
        },
        {
          title: "Alert Status",
          value: 0,
        },
      ];
    const userSet = new Set();
    const countrySet = new Set();
    const statusCount: Record<string, number> = {};
    filteredEvents.forEach((event) => {
      const e = event as any;
      const userId = e.userId;
      const country = e.location?.country;
      const status = e.status;
      if (userId) userSet.add(userId);
      if (country) countrySet.add(country);
      if (status) {
        statusCount[status] = (statusCount[status] || 0) + 1;
      }
    });

    return [
      {
        title: "Total Users Affected",
        value: userSet.size || 0,
      },
      {
        title: "Total Events",
        value: filteredEvents.length || 0,
      },
      {
        title: "Total Countries Affected",
        value: countrySet.size || 0,
      },
      {
        title: "Alert Status",
        value: statusCount,
      },
    ];
  }, [filteredEvents]);

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
