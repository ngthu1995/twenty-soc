import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import SeverityChip from "../shared/SeverityChip";

type SOCDialogProps = {
  selectedEvent: any;
  open: boolean;
  handleClose: () => void;
};

type EventDetails = Record<string, unknown>;

export function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const DetailsSection = ({ details }: { details: EventDetails }) => {
  return (
    <Grid container spacing={1}>
      {Object.entries(details).map(([key, value]) => (
        <Grid key={key} size={{ xs: 12, md: 6 }}>
          <Typography>
            <b>{formatKey(key)}:</b>{" "}
            {Array.isArray(value) ? value.join(", ") : String(value || "-")}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
export const SOCDialog: React.FC<SOCDialogProps> = ({
  open,
  handleClose,
  selectedEvent,
}) => {
  if (!selectedEvent) return null;
  const {
    eventId,
    timestamp,
    eventType,
    subType,
    severity,
    source,
    sourceIp,
    destinationIp,
    userId,
    location,
    status,
    details,
  } = selectedEvent || {};

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Event Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography>
              <b>Event ID:</b> {eventId}
            </Typography>
            <Typography>
              <b>Timestamp:</b> {new Date(timestamp).toLocaleString()}
            </Typography>
            <Typography>
              <b>Event Type:</b> {eventType}
            </Typography>
            <Typography>
              <b>Sub Type:</b> {subType}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography>
              Severity: <SeverityChip value={severity} />
            </Typography>
            <Typography>
              <b>Status:</b> {status}
            </Typography>
            <Typography>
              <b>User:</b> {userId}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Source & Destination</Typography>
        <Typography>
          <b>Source:</b> {source}
        </Typography>
        <Typography>
          <b>Source IP:</b> {sourceIp}
        </Typography>
        <Typography>
          <b>Destination IP:</b> {destinationIp}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Location</Typography>
        {location ? (
          <Typography>
            {location.city}, {location.country}
          </Typography>
        ) : (
          <Typography color="text.secondary">No location data</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Details</Typography>
        {details ? (
          <DetailsSection details={details} />
        ) : (
          <Typography color="text.secondary">No additional details</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
