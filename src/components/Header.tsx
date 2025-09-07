import { Box, Typography } from "@mui/material";
import twentyLogo from "../assets/twentyLogo.jpg";

export const SOCHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "leftalign",
        bgcolor: "black",
        color: "primary.contrastText",

        boxShadow: 2,
        mb: 1,
      }}
    >
      <img
        src={twentyLogo}
        alt="Twenty Logo"
        style={{ height: 36, margin: 10 }}
      />
      <Typography variant="subtitle2" fontWeight="bold">
        Security Operations Center (SOC) Dashboard
      </Typography>
    </Box>
  );
};
