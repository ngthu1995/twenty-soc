import { ApolloProvider } from "@apollo/client/react";
import { InMemoryCache, HttpLink, ApolloClient } from "@apollo/client";
import { Header } from "./components/Header";
import { Content } from "./components/Content";
import { FilterProvider } from "./context/FilterContext";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppTheme from "./theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme";
import { alpha } from "@mui/material/styles";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function App(props: { disableCustomTheme?: boolean }) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "http://localhost:4000/graphql",
    }),
  });
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <ApolloProvider client={client}>
        <Box sx={{ display: "flex" }}>
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <FilterProvider>
                <Header />
                <Content />
              </FilterProvider>
            </Stack>
          </Box>
        </Box>
      </ApolloProvider>
    </AppTheme>
  );
}

export default App;
