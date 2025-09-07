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
    <Grid container direction="row" spacing={2} sx={{ p: 2 }}>
      {/* Filter panel at top */}
      <Grid size={{ xs: 12 }} sx={{ bgcolor: "background.paper" }}>
        <FiltersPanel
          eventTypeOptions={eventTypeOptions}
          sourceCountriesOptions={sourceCountriesOptions}
        />
      </Grid>

      {/* DataTable at bottom */}
      <Grid size={{ xs: 12 }}>
        <DataTable loading={eventsLoading} error={eventsError} data={events} />
      </Grid>

      {/* Dashboard below filter panel */}
      <Grid size={{ xs: 12 }} sx={{ marginY: 2 }}>
        <Dashboard
          loading={eventSummaryLoading}
          data={summaryData}
          error={eventSummaryError}
        />
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
