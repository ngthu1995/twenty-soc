import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { FiltersPanel } from "./FiltersPanel";
import { DataTable } from "./DataTable";
import {
  GET_SECURITY_EVENTS,
  GET_SECURITY_EVENT_SUMMARY,
} from "../apollo/queries";
import { useQuery } from "@apollo/client/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { Dashboard } from "./Dashboard";
import { camelizeKeys } from "../shared/utils";
import { mocks } from "../apollo/mocks";

export const ContentData = () => {
  // These 2 APIS will support var dates range filter in future
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

    // Ideally we should do this transformation in the backend
    return camelizeKeys(eventSummary as any);
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
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid>
        <FiltersPanel
          eventTypeOptions={eventTypeOptions}
          sourceCountriesOptions={sourceCountriesOptions}
        />
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Dashboard
          loading={eventSummaryLoading}
          data={summaryData}
          error={eventSummaryError}
        />
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12 }} style={{ overflowX: "auto" }}>
          <DataTable
            loading={eventsLoading}
            error={eventsError}
            data={events}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const Content = () => {
  return (
    <MockedProvider mocks={mocks}>
      <ContentData />
    </MockedProvider>
  );
};
