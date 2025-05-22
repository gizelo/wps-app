import { Box, Typography } from "@mui/material";

export function Home() {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          WPS Maker 4.0
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Weld Quality Assurance Toolkit
        </Typography>
      </Box>
    </Box>
  );
}
