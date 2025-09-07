import React from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import { severityOptions } from "../utils";
import { defaultFilterState, useFilters } from "../FilterContext";
import { countries } from "../assets/countryCodes";

type FitersPanelProps = {
  eventTypeOptions: string[];
  sourceCountriesOptions: string[];
};

export const FiltersPanel = React.memo(function FiltersPanel({
  eventTypeOptions,
  sourceCountriesOptions,
}: FitersPanelProps) {
  const { activeFilterColumns, setActiveFilterColumns } = useFilters();
  // Use all country labels from countryCodes for options

  return (
    <Box display="flex" gap={2} flexWrap="wrap" m={2}>
      <TextField
        select
        label="Severity"
        value={activeFilterColumns.severity || ""}
        onChange={(e) =>
          setActiveFilterColumns((prev) => ({
            ...prev,
            severity: e.target.value,
          }))
        }
        size="small"
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) => (value === "" ? "All" : String(value)),
        }}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 180, "& .MuiInputBase-input": { textAlign: "left" } }}
      >
        <MenuItem value="">All</MenuItem>
        {severityOptions.map((sev) => (
          <MenuItem key={sev} value={sev}>
            {sev}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Event Type"
        value={activeFilterColumns.eventType}
        onChange={(e) =>
          setActiveFilterColumns((prev) => ({
            ...prev,
            eventType: e.target.value,
          }))
        }
        size="small"
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) => (value === "" ? "All" : String(value)),
        }}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 180, "& .MuiInputBase-input": { textAlign: "left" } }}
      >
        <MenuItem value="">All</MenuItem>
        {eventTypeOptions.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Source Country"
        value={activeFilterColumns.source}
        onChange={(e) =>
          setActiveFilterColumns((prev) => ({
            ...prev,
            source: e.target.value,
          }))
        }
        size="small"
        SelectProps={{
          displayEmpty: true,
          renderValue: (value) => (value === "" ? "All" : String(value)),
        }}
        InputLabelProps={{ shrink: true }}
        sx={{ width: 180, "& .MuiInputBase-input": { textAlign: "left" } }}
      >
        <MenuItem value="">All</MenuItem>
        {countries.map(({ code, label }) => {
          const hasEvents = sourceCountriesOptions.includes(label);
          return (
            <MenuItem
              key={label}
              value={label}
              style={hasEvents ? { fontWeight: 700 } : { color: "#888" }}
            >
              <Box sx={{ "& > img": { mr: 2, flexShrink: 0 } }}>
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
                  alt={`${label}`}
                />
                {label}
              </Box>
            </MenuItem>
          );
        })}
      </TextField>

      <TextField
        label="Start Date"
        type="date"
        value={activeFilterColumns.startDate}
        onChange={(e) =>
          setActiveFilterColumns((prev) => ({
            ...prev,
            startDate: e.target.value,
          }))
        }
        size="small"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 180, "& .MuiInputBase-input": { textAlign: "left" } }}
        InputProps={{ style: { textAlign: "left" } }}
      />
      <TextField
        label="End Date"
        type="date"
        value={activeFilterColumns.endDate}
        onChange={(e) =>
          setActiveFilterColumns((prev) => ({
            ...prev,
            endDate: e.target.value,
          }))
        }
        size="small"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 180, "& .MuiInputBase-input": { textAlign: "left" } }}
        InputProps={{ style: { textAlign: "left" } }}
      />

      <Button
        variant="outlined"
        onClick={() => {
          setActiveFilterColumns(defaultFilterState);
        }}
      >
        Reset
      </Button>
    </Box>
  );
});
