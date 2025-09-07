import Stack from "@mui/material/Stack";
import ColorModeIconDropdown from "../theme/ColorModeIconDropdown";
import { styled } from "@mui/material/styles";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";

import { Box, Typography } from "@mui/material";
import twentyLogo from "../assets/twentyLogo.jpg";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export const Header = () => {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <StyledBreadcrumbs aria-label="breadcrumb">
        <img src={twentyLogo} alt="Twenty Logo" style={{ height: 36 }} />

        <Typography variant="subtitle2" fontWeight="bold">
          Security Operations Center Dashboard
        </Typography>
      </StyledBreadcrumbs>
      <Stack
        direction="row"
        sx={{ gap: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <Stack
          direction="row"
          sx={{ gap: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ColorModeIconDropdown />
        </Stack>
      </Stack>
    </Stack>
  );
};
