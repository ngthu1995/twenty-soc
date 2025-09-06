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
        px: 3,
        py: 1,
        boxShadow: 2,
        mb: 3,
      }}
    >
      <img
        src={twentyLogo}
        alt="Twenty Logo"
        style={{ height: 48, margin: 10 }}
      />
      <Typography variant="subtitle1" fontWeight="bold">
        Security Operations Center (SOC) Dashboard
      </Typography>
    </Box>
  );
};
