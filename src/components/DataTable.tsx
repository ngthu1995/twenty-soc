import { useMemo, useState, useEffect } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Typography, Box, Tooltip, Chip } from "@mui/material";
import { useFilters } from "../FilterContext";

import { camelizeKeys, severityColors } from "../utils";
import { countries } from "../assets/countryCodes";
import { SOCDialog } from "./Dialog";
import { faAnglesUp, faInfo, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";

type DataTableProps = {
  loading: boolean;
  error: any;
  data: any;
};

export const DataTable = (props: DataTableProps) => {
  const { loading, error, data } = props;
  const [acknowledgedRows, setAcknowledgedRows] = useState<
    Record<number, boolean>
  >({});
  const [escalatedRows, setEscalatedRows] = useState<Record<number, boolean>>(
    {}
  );

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedRows, setselectedRows] = useState<any>(null);

  const { activeFilterColumns, setSelectedEvents, setFilteredEvents } =
    useFilters();

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
    const updatedRows = camelizeKeys(data as any).securityEvents.map(
      (item: any, i: number) => ({
        ...item,
        id: item.eventId,
        source: item?.location?.country,
        system: item?.source,
      })
    );
    setRows(updatedRows);
  }, [data]);

  useEffect(() => {
    const selectedEvents = rows.filter((row) =>
      (selectedRows as any).ids.has(row.eventId)
    );

    setSelectedEvents(selectedEvents as any[]);
  }, [selectedRows]);

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    if (
      !activeFilterColumns.severity &&
      !activeFilterColumns.eventType &&
      !activeFilterColumns.source &&
      !activeFilterColumns.startDate &&
      !activeFilterColumns.endDate
    )
      return rows;
    return rows.filter((row) => {
      const inSeverity =
        !activeFilterColumns.severity ||
        row.severity === activeFilterColumns.severity;
      const inType =
        !activeFilterColumns.eventType ||
        row.eventType === activeFilterColumns.eventType;
      const inSource =
        !activeFilterColumns.source ||
        row.source
          .toLowerCase()
          .includes(activeFilterColumns.source.toLowerCase());
      const inDateRange =
        (!activeFilterColumns.startDate ||
          dayjs(row.timestamp).isAfter(dayjs(activeFilterColumns.startDate))) &&
        (!activeFilterColumns.endDate ||
          dayjs(row.timestamp).isBefore(dayjs(activeFilterColumns.endDate)));
      return inSeverity && inType && inSource && inDateRange;
    });
  }, [
    activeFilterColumns.severity,
    activeFilterColumns.eventType,
    activeFilterColumns.source,
    activeFilterColumns.startDate,
    activeFilterColumns.endDate,
    rows,
  ]);

  useEffect(() => {
    setFilteredEvents(filteredRows);
  }, [filteredRows]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Timestamp",

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

      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              height: "100%",
            }}
          >
            <span
              style={{
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "6px",
                backgroundColor: severityColors[params.value] || "#999",
                minWidth: 56,
                maxWidth: 80,
                textAlign: "center",

                lineHeight: 1.5,
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    { field: "system", headerName: "System" },
    {
      field: "source",
      headerName: "Source Country",

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
    { field: "destinationIp", headerName: "Destination IP" },
    {
      field: "userId",
      headerName: "User",

      valueGetter: (value) => {
        if (!value) return "-";
        return value;
      },
    },
    {
      field: "status",
      headerName: "Status",

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
      flex: 1,
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
              <span style={{ display: "inline-block" }}>
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
            <Button size="large" onClick={() => handleOpenDialog(params.row)}>
              <FontAwesomeIcon icon={faInfo} color="primary" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pagination
        checkboxSelection
        disableColumnFilter={true}
        disableColumnMenu={true}
        disableRowSelectionOnClick
        rowBufferPx={600}
        initialState={{
          sorting: {
            sortModel: [{ field: "timestamp", sort: "desc" }],
          },
        }}
        slots={{
          columnMenu: () => null,
        }}
        sx={{ overflowX: "scroll" }}
        onRowSelectionModelChange={setselectedRows}
      />
      <SOCDialog
        selectedEvent={selectedEvent}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
};
