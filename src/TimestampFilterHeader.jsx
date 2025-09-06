import { Menu, MenuItem, Button, Divider } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { faAnglesUp, faInfo, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export const TimestampFilterHeader = () => {
  const [anchorEl, setAnchorEl] = (useState < null) | (HTMLElement > null);
  const [timestampFilter, setTimestampFilter] =
    (useState < "all") | "15m" | "1h" | "24h" | "7d" | ("custom" > "all");
  const [fromDate, setFromDate] = (useState < Date) | (null > null);
  const [toDate, setToDate] = (useState < Date) | (null > null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      Timestamp
      <Button size="small" onClick={handleClick}>
        <FontAwesomeIcon icon={faInfo} color="primary" />
      </Button>
      {/* <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => setTimestampFilter("15m")}>
          Last 15 minutes
        </MenuItem>
        <MenuItem onClick={() => setTimestampFilter("1h")}>
          Last 1 hour
        </MenuItem>
        <MenuItem onClick={() => setTimestampFilter("24h")}>
          Last 24 hours
        </MenuItem>
        <MenuItem onClick={() => setTimestampFilter("7d")}>
          Last 7 days
        </MenuItem>
        <Divider />
        <MenuItem>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DateTimePicker
              label="From"
              value={fromDate}
              onChange={setFromDate}
            />
            <DateTimePicker label="To" value={toDate} onChange={setToDate} />
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setTimestampFilter("custom");
                handleClose();
              }}
            >
              Apply
            </Button>
          </div>
        </MenuItem>
      </Menu> */}
    </div>
  );
};
