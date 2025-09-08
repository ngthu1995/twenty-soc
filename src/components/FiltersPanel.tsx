import React from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import { severityOptions } from "../shared/utils";
import { defaultFilterState, useFilters } from "../context/FilterContext";
import { countries } from "../assets/countryCodes";
import { useFilterStore } from "../store/filterStore";

type FitersPanelProps = {
  eventTypeOptions: string[];
  sourceCountriesOptions: string[];
};

export const FiltersPanel = React.memo(function FiltersPanel({
  eventTypeOptions,
  sourceCountriesOptions,
}: FitersPanelProps) {
  // const { activeFilterColumns, setActiveFilterColumns } = useFilters();

  const activeFilterColumns = useFilterStore(
    (state) => state.activeFilterColumns
  );
  const setActiveFilterColumns = useFilterStore(
    (state) => state.setActiveFilterColumns
  );
  // const filteredEvents = useFilterStore((state) => state.filteredEvents);

  // Use all country labels from countryCodes for options

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <TextField
        select
        label="Severity"
        value={activeFilterColumns.severity || ""}
        onChange={(e) =>
          setActiveFilterColumns({
            ...activeFilterColumns,
            severity: e.target.value,
          })
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
          setActiveFilterColumns({
            ...activeFilterColumns,
            eventType: e.target.value,
          })
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
          setActiveFilterColumns({
            ...activeFilterColumns,
            source: e.target.value,
          })
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
