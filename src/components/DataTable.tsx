import { useMemo, useState, useEffect } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Typography, Box, Tooltip } from "@mui/material";
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
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "6px",
            backgroundColor: severityColors[params.value] || "#999",
          }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "system", headerName: "System", flex: 1 },
    {
      field: "source",
      headerName: "Source Country",
      flex: 1,
      renderCell: (params) => {
        const countryName = params.row.location.country;
        const foundCountry = countries.find(
          (country) => country.label === countryName
        );

        if (!foundCountry) return countryName;
        return (
          <Box sx={{ "& > img": { mr: 2, flexShrink: 0 } }}>
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${foundCountry.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${foundCountry.code.toLowerCase()}.png`}
              alt={`${countryName}`}
            />
            {countryName}
          </Box>
        );
      },
    },
    { field: "destinationIp", headerName: "Destination IP", flex: 1 },
    {
      field: "userId",
      headerName: "User",
      flex: 1,
      valueGetter: (value) => {
        if (!value) return "-";
        return value;
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Quick Actions",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          <Tooltip
            title={
              acknowledgedRows[params.row.id]
                ? "Alert acknowledged"
                : "Acknowledge this alert"
            }
          >
            <Button
              size="large"
              disableRipple={true}
              onClick={() => {
                setAcknowledgedRows((prev) => ({
                  ...prev,
                  [params.row.id]: true,
                }));
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                color={acknowledgedRows[params.row.id] ? "primary" : "grey"}
              />
            </Button>
          </Tooltip>
          <Tooltip
            title={
              acknowledgedRows[params.row.id]
                ? "Alert escalated"
                : "Escalate this alert"
            }
          >
            <Button
              size="large"
              disableRipple={true}
              onClick={() => {
                setEscalatedRows((prev) => ({
                  ...prev,
                  [params.row.id]: true,
                }));
              }}
            >
              <FontAwesomeIcon
                icon={faAnglesUp}
                color={escalatedRows[params.row.id] ? "primary" : "grey"}
              />
            </Button>
          </Tooltip>
          <Button size="large" onClick={() => handleOpenDialog(params.row)}>
            <FontAwesomeIcon icon={faInfo} color="primary" />
          </Button>
        </div>
      ),
    },
  ];

  function DataGridTitle() {
    return (
      <Box
        style={{
          width: "100%",
        }}
      >
        <Typography variant="h6">Security Events</Typography>
      </Box>
    );
  }

  return (
    <div style={{ height: 450, width: "100%" }}>
      <DataGridTitle />,
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
          columnMenu: (props) => null,
        }}
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
