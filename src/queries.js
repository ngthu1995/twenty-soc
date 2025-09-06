import { gql } from "@apollo/client";

export const GET_SECURITY_EVENTS = gql`
  query GetSecurityEvents {
    securityEvents {
      event_id
      timestamp
      event_type
      sub_type
      severity
      source
      source_ip
      destination_ip
      user_id
      status
      location {
        country
        city
      }
      details: JSON
    }
  }
`;

export const GET_SECURITY_EVENT_SUMMARY = gql`
  query GetSecurityEventSummary {
    securityEventSummary {
      eventCountsByType {
        Authentication
        Network
        Malware
        Policy
        Vulnerability
      }
      severityDistribution {
        Critical
        High
        Medium
        Low
      }
      eventTimeline {
        hour
        count
      }
      topSourceCountries {
        country
        count
        connectionOnly
      }
      topAffectedUsers {
        userId
        events
        severityScores {
          Critical
          High
          Medium
          Low
        }
      }
      alertStatus {
        Open
        Investigating
        Closed
      }
      attackTechniques {
        technique
        subTechniques
        count
      }
      hourlyCriticalEvents {
        hour
        count
      }
    }
  }
`;
