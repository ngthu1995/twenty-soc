import dayjs from "dayjs";

// Convert snake_case string to camelCase
function toCamel(str: string): string {
  return str.replace(/([-_][a-z])/gi, (s) =>
    s.toUpperCase().replace("-", "").replace("_", "")
  );
}

// Recursively convert object keys
export function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      result[toCamel(key)] = camelizeKeys(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export const severityColors: Record<string, string> = {
  Critical: "#EF4444",
  High: "#F97316",
  Medium: "#EAB308",
  Low: "#10B981",
};

export const severityOptions = ["Low", "Medium", "High", "Critical"];
export const eventTypeOptions = [
  "Malware",
  "Phishing",
  "DDoS",
  "Unauthorized Access",
];

type SecurityEvent = {
  timestamp: string;
  severity: "Critical" | "High" | "Medium" | "Low";
};

type TimeSeriesBucket = {
  time: Date;
  Total: number;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
};

export function aggregateEventsByHour(
  events: SecurityEvent[]
): TimeSeriesBucket[] {
  const buckets: { [hour: string]: TimeSeriesBucket } = {};

  events.forEach((event) => {
    const date = dayjs(event.timestamp);
    // Get hour bucket start time
    const hourStart = date.startOf("hour");
    const hourKey = hourStart.format("YYYY-MM-DD HH:00");

    if (!buckets[hourKey]) {
      buckets[hourKey] = {
        time: hourStart.toDate(),
        Total: 0,
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0,
      };
    }

    buckets[hourKey].Total += 1;
    buckets[hourKey][event.severity] += 1;
  });

  // Return sorted array by time
  return Object.values(buckets).sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  );
}

export function getSeverityPieData(
  filteredEvents: SecurityEvent[]
): { label: string; value: number; color: string }[] {
  const severityCounts: Record<string, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  filteredEvents.forEach((event) => {
    if (severityCounts.hasOwnProperty(event.severity)) {
      severityCounts[event.severity] += 1;
    }
  });
  return Object.keys(severityCounts)
    .filter((severity) => severityCounts[severity] > 0)
    .map((severity) => ({
      label: severity,
      value: severityCounts[severity],
      color: severityColors[severity],
    }));
}
