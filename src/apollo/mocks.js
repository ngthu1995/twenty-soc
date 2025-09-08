import summaryMockData from "../assets/Aggregate.json";
import eventsMockData from "../assets/SecurityEventsData.json";
import { GET_SECURITY_EVENTS, GET_SECURITY_EVENT_SUMMARY } from "./queries";

export const mocks = [
  {
    request: {
      query: GET_SECURITY_EVENTS,
      variables: {},
    },
    result: {
      data: {
        securityEvents: eventsMockData,
      },
    },
  },
  {
    request: {
      query: GET_SECURITY_EVENTS,
      variables: {},
    },
    result: {
      data: {
        securityEvents: eventsMockData,
      },
    },
  },
  {
    request: {
      query: GET_SECURITY_EVENT_SUMMARY,
      variables: {},
    },
    result: {
      data: {
        securityEventSummary: summaryMockData,
      },
    },
  },
  {
    request: {
      query: GET_SECURITY_EVENT_SUMMARY,
      variables: {},
    },
    result: {
      data: {
        securityEventSummary: summaryMockData,
      },
    },
  },
];
