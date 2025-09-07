import { Box, IconButton, Grid } from "@mui/material";
import { useState, useMemo } from "react";
import { FiltersPanel } from "./FiltersPanel";
import { DataTable } from "./DataTable";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET_SECURITY_EVENTS, GET_SECURITY_EVENT_SUMMARY } from "../queries";
import { useQuery } from "@apollo/client/react";
import summaryMockData from "../assets/Aggregate.json";
import eventsMockData from "../assets/SecurityEventsData.json";
import { MockedProvider } from "@apollo/client/testing/react";
import { Dashboard } from "./Dashboard";
import { camelizeKeys } from "../utils";

const mocks = [
  {
    request: {
      query: GET_SECURITY_EVENTS,
      variables: {},
    },
    result: {
      data: {
        securityEvents: eventsMockData,
      },
    },
  },
  {
    request: {
      query: GET_SECURITY_EVENTS,
      variables: {},
    },
    result: {
      data: {
        securityEvents: eventsMockData,
      },
    },
  },
  {
    request: {
      query: GET_SECURITY_EVENT_SUMMARY,
      variables: {},
    },
    result: {
      data: {
        securityEventSummary: summaryMockData,
      },
    },
  },
  {
    request: {
      query: GET_SECURITY_EVENT_SUMMARY,
      variables: {},
    },
    result: {
      data: {
        securityEventSummary: summaryMockData,
      },
    },
  },
];

export const Layout1 = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    loading: eventsLoading,
    error: eventsError,
    data: events,
  } = useQuery(GET_SECURITY_EVENTS, {
    fetchPolicy: "cache-first",
  });
  const {
    loading: eventSummaryLoading,
    error: eventSummaryError,
    data: eventSummary,
  } = useQuery(GET_SECURITY_EVENT_SUMMARY, {
    fetchPolicy: "cache-first",
  });

  const summaryData = useMemo(() => {
    if (!eventSummary) return [];
    return camelizeKeys(eventSummary as any).securityEventSummary;
  }, [eventSummary]);

  const eventTypeOptions = useMemo(() => {
    if (!events) return [];
    return Array.from(
      new Set((events as any).securityEvents.map((e: any) => e.event_type))
    ) as string[];
  }, [events]);

  const sourceCountriesOptions = useMemo(() => {
    if (!events) return [];
    return Array.from(
      new Set(
        (events as any).securityEvents.map((e: any) => e.location.country)
      )
    ) as string[];
  }, [events]);

  return (
    <Grid
      container
      sx={{ height: "100vh", flexDirection: "column" }}
      direction={{ xs: "row", sm: "column", md: "column" }}
      spacing={2}
    >
      {/* Collapsible left panel */}
      <Grid
        size={{
          xs: collapsed ? 0 : 12,
          sm: collapsed ? 0 : 2,
          md: collapsed ? 0 : 2,
        }}
        sx={{
          transition: "all 0.3s",
          overflow: "hidden",
          minWidth: collapsed ? 0 : 220,
          maxWidth: collapsed ? 0 : 320,
          bgcolor: "background.paper",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "100%",
            p: 2,
            display: collapsed ? "none" : "block",
          }}
        >
          <FiltersPanel
            eventTypeOptions={eventTypeOptions}
            sourceCountriesOptions={sourceCountriesOptions}
          />
        </Box>
      </Grid>
      {/* Right content grows when collapsed */}
      <Grid
        size={{
          xs: 12,
          sm: collapsed ? 12 : 10,
          md: collapsed ? 12 : 10,
          lg: collapsed ? 12 : 10,
        }}
        sx={{ transition: "all 0.3s", height: "100%", position: "relative" }}
      >
        {/* Always visible collapse/expand icon */}
        <IconButton
          onClick={() => setCollapsed((c) => !c)}
          sx={{
            position: "absolute",
            top: 16,
            left: 0,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 2,
            zIndex: 10,
          }}
        >
          {!collapsed ? (
            <FontAwesomeIcon icon={faArrowLeft} color="#1976d2" />
          ) : (
            <FontAwesomeIcon icon={faArrowRight} color="#1976d2" />
          )}
        </IconButton>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ flex: 1, marginTop: 2 }}>
            <Dashboard
              loading={eventSummaryLoading}
              data={summaryData}
              error={eventSummaryError}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataTable
              loading={eventsLoading}
              error={eventsError}
              data={events}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export const Layout = () => {
  return (
    <MockedProvider mocks={mocks}>
      <Layout1 />
    </MockedProvider>
  );
};
