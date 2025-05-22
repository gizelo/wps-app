import { Box, Typography } from "@mui/material";

export function Home() {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to WPS Maker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your comprehensive solution for managing Welding Procedure
          Specifications
        </Typography>
      </Box>
    </Box>
  );
}
