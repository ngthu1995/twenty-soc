import { useMemo, useState, useEffect } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Typography, Box, Tooltip, Chip } from "@mui/material";
import { defaultFilterState, useFilters } from "../context/FilterContext";

import { camelizeKeys, isDefaultFilterState } from "../shared/utils";
import { countries } from "../assets/countryCodes";
import { SOCDialog } from "./Dialog";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import SeverityChip from "../shared/SeverityChip";

type DataTableProps = {
  loading: boolean;
  error: any;
  data: any;
};

export const DataTable = (props: DataTableProps) => {
  const { loading, error, data } = props;
  const { activeFilterColumns, setSelectedEvents, setFilteredEvents } =
    useFilters();
  const { severity, eventType, source, startDate, endDate } =
    activeFilterColumns;

  // total events from API
  const [events, setEvents] = useState<any[]>([]);

  // selected event for dialog
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // selected rows for bulk actions
  const [selectedRows, setSelectedRows] = useState<any>(null);

  const [acknowledgedRows, setAcknowledgedRows] = useState<
    Record<number, boolean>
  >({});
  const [escalatedRows, setEscalatedRows] = useState<Record<number, boolean>>(
    {}
  );
  const [open, setOpen] = useState(false);

  const handleOpenDialog = (row: any) => {
    setSelectedEvent(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (!data) return;
    const updatedRows = camelizeKeys(data as any)
      .securityEvents?.filter((item: any) => item.eventId)
      .map((item: any, i: number) => ({
        ...item,
        id: item.eventId,
        source: item?.location?.country,
        system: item?.source,
      }));
    setEvents(updatedRows);
  }, [data]);

  useEffect(() => {
    const selectedEvents = events.filter((row) =>
      (selectedRows as any).ids.has(row.eventId)
    );

    setSelectedEvents(selectedEvents as any[]);
  }, [selectedRows]);

  const filteredRows = useMemo(() => {
    if (!events) return [];

    const isFiltersDefault = isDefaultFilterState(
      activeFilterColumns,
      defaultFilterState
    );

    if (isFiltersDefault) return events;
    return events.filter((row) => {
      const inSeverity = !severity || row.severity === severity;
      const inType = !eventType || row.eventType === eventType;
      const inSource =
        !source || row.source.toLowerCase().includes(source.toLowerCase());
      const inDateRange =
        (!startDate || dayjs(row.timestamp).isAfter(dayjs(startDate))) &&
        (!endDate || dayjs(row.timestamp).isBefore(dayjs(endDate)));
      return inSeverity && inType && inSource && inDateRange;
    });
  }, [severity, eventType, source, startDate, endDate, events]);

  useEffect(() => {
    setFilteredEvents(filteredRows);
  }, [filteredRows]);

  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Timestamp",
      flex: 1.5,
      minWidth: 150,
      valueGetter: (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? "" : date.getTime();
      },
      renderCell: (params) => {
        const date = new Date(params.row.timestamp);
        return isNaN(date.getTime()) ? "" : date.toLocaleString();
      },
    },
    {
      field: "eventType",
      headerName: "Event Type",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => {
        const { eventType, subType } = params.row;
        return (
          <div>
            <Typography>{eventType}</Typography>
            <Typography color="textSecondary">{subType}</Typography>
          </div>
        );
      },
    },
    {
      field: "severity",
      headerName: "Severity",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return <SeverityChip value={params.value} />;
      },
    },
    {
      field: "system",
      headerName: "System",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "source",
      headerName: "Country",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 120,

      renderCell: (params) => {
        const countryName = params.row.location.country;
        const foundCountry = countries.find(
          (country) => country.label === countryName
        );

        if (!foundCountry) return countryName;
        return (
          <Box sx={{ "& > img": { mr: 2, flexShrink: 0 } }}>{countryName}</Box>
        );
      },
    },
    {
      field: "destinationIp",
      headerName: "Destination IP",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "userId",
      headerName: "User",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 100,
      valueGetter: (value) => {
        if (!value) return "-";
        return value;
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value}
            variant="outlined"
            color={
              {
                Closed: "default",
                Investigating: "secondary",
                Open: "error",
              }[params.value as string] || "default"
            }
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Quick Actions",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      minWidth: 350,
      renderCell: (params) => {
        const isEscalated = escalatedRows[params.row.id];
        const isAcknowledged = acknowledgedRows[params.row.id];
        return (
          <div>
            <Tooltip
              title={
                isAcknowledged ? "Alert acknowledged" : "Acknowledge this alert"
              }
            >
              <span style={{ display: "inline-block", marginRight: 8 }}>
                <Button
                  size="large"
                  disableRipple={true}
                  color="success"
                  variant="outlined"
                  disabled={isAcknowledged}
                  onClick={() => {
                    setAcknowledgedRows((prev) => ({
                      ...prev,
                      [params.row.id]: true,
                    }));
                  }}
                >
                  <Typography>
                    {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                  </Typography>
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={isEscalated ? "Alert escalated" : "Escalate this alert"}
            >
              <span style={{ display: "inline-block", marginRight: 8 }}>
                <Button
                  size="large"
                  variant="outlined"
                  disabled={isEscalated}
                  disableRipple={true}
                  onClick={() => {
                    setEscalatedRows((prev) => ({
                      ...prev,
                      [params.row.id]: true,
                    }));
                  }}
                >
                  <Typography>
                    {isEscalated ? "Escalated" : "Escalate"}
                  </Typography>
                </Button>
              </span>
            </Tooltip>
            <Button
              size="large"
              disableRipple={true}
              color="success"
              variant="outlined"
              onClick={() => handleOpenDialog(params.row)}
            >
              <FontAwesomeIcon icon={faInfo} color="primary" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        checkboxSelection
        rows={filteredRows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          sorting: {
            sortModel: [{ field: "timestamp", sort: "desc" }],
          },
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableRowSelectionOnClick
        rowBufferPx={600}
        slots={{
          columnMenu: () => null,
        }}
        onRowSelectionModelChange={setSelectedRows}
      />
      <SOCDialog
        selectedEvent={selectedEvent}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
};
