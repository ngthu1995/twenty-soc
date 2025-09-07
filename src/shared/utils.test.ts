import {
  aggregateEventsByHour,
  getSeverityPieData,
  getOtherStat,
  SecurityEvent,
} from "../utils";

describe("aggregateEventsByHour", () => {
  it("returns empty array for no events", () => {
    expect(aggregateEventsByHour([])).toEqual([]);
  });

  it("aggregates events by hour and severity", () => {
    const events: SecurityEvent[] = [
      { timestamp: "2025-09-07T12:15:00Z", severity: "High" },
      { timestamp: "2025-09-07T12:45:00Z", severity: "Low" },
      { timestamp: "2025-09-07T13:05:00Z", severity: "High" },
      { timestamp: "2025-09-07T12:30:00Z", severity: "High" },
    ];
    const result = aggregateEventsByHour(events);
    expect(result.length).toBe(2);
    expect(result[0].Total).toBe(3); // 3 events in 12:00 hour
    expect(result[0].High).toBe(2);
    expect(result[0].Low).toBe(1);
    expect(result[1].Total).toBe(1); // 1 event in 13:00 hour
    expect(result[1].High).toBe(1);
    expect(result[1].Low).toBe(0);
  });

  it("sorts buckets by time ascending", () => {
    const events: SecurityEvent[] = [
      { timestamp: "2025-09-07T14:00:00Z", severity: "Medium" },
      { timestamp: "2025-09-07T13:00:00Z", severity: "Low" },
    ];
    const result = aggregateEventsByHour(events);
    expect(result[0].time.getUTCHours()).toBe(13);
    expect(result[1].time.getUTCHours()).toBe(14);
  });
});

describe("getSeverityPieData", () => {
  it("returns empty array for no events", () => {
    expect(getSeverityPieData([])).toEqual([]);
  });

  it("returns correct pie data for mixed severities", () => {
    const events: SecurityEvent[] = [
      { timestamp: "2025-09-07T12:00:00Z", severity: "High" },
      { timestamp: "2025-09-07T13:00:00Z", severity: "Low" },
      { timestamp: "2025-09-07T14:00:00Z", severity: "High" },
      { timestamp: "2025-09-07T15:00:00Z", severity: "Critical" },
    ];
    const result = getSeverityPieData(events);
    expect(result).toEqual([
      { label: "Critical", value: 1, color: "#EF4444" },
      { label: "High", value: 2, color: "#F97316" },
      { label: "Low", value: 1, color: "#10B981" },
    ]);
  });

  it("returns only severities present in events", () => {
    const events: SecurityEvent[] = [
      { timestamp: "2025-09-07T12:00:00Z", severity: "Medium" },
      { timestamp: "2025-09-07T13:00:00Z", severity: "Medium" },
    ];
    const result = getSeverityPieData(events);
    expect(result).toEqual([{ label: "Medium", value: 2, color: "#EAB308" }]);
  });
});

describe("getOtherStat", () => {
  it("returns zero stats for empty events", () => {
    const result = getOtherStat([]);
    expect(result).toEqual([
      { title: "Total Users Affected", value: 0 },
      { title: "Total Events", value: 0 },
      { title: "Total Countries Affected", value: 0 },
      { title: "Alert Status", value: 0 },
    ]);
  });

  it("returns correct stats for events", () => {
    const events = [
      {
        userId: "user1",
        location: { country: "USA" },
        status: "Open",
      },
      {
        userId: "user2",
        location: { country: "Canada" },
        status: "Closed",
      },
      {
        userId: "user1",
        location: { country: "USA" },
        status: "Open",
      },
      {
        userId: "user3",
        location: { country: "USA" },
        status: "Investigating",
      },
    ];
    const result = getOtherStat(events);
    expect(result[0]).toEqual({ title: "Total Users Affected", value: 3 });
    expect(result[1]).toEqual({ title: "Total Events", value: 4 });
    expect(result[2]).toEqual({ title: "Total Countries Affected", value: 2 });
    expect(result[3].title).toBe("Alert Status");
    expect(result[3].value).toEqual({ Open: 2, Closed: 1, Investigating: 1 });
  });
});
