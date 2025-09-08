import React from "react";
import { severityColors } from "../shared/utils";

interface SeverityChipProps {
  value: string;
}
const SeverityChip: React.FC<SeverityChipProps> = ({ value }) => (
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
        backgroundColor: severityColors[value] || "#999",
        width: 70,
        textAlign: "center",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {value}
    </span>
  </div>
);

export default SeverityChip;
