import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type StatCardProps = {
  title: string;
  value: number | Record<string, number>;
};

export const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Stack direction="column" sx={{ width: "100%" }}>
                {typeof value === "number" ? (
                  <Typography variant="h4" component="p" fontWeight="bold">
                    {value}
                  </Typography>
                ) : (
                  Object.entries(value).map(([k, v]) => (
                    <Typography
                      variant="body2"
                      component="p"
                      key={k}
                      sx={{ width: "100%", fontWeight: "bold" }}
                    >
                      {`${k}: ${v}`}
                    </Typography>
                  ))
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
