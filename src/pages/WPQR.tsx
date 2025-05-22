import { Box, Typography } from "@mui/material";
import { ActionButtons } from "../components/ActionButtons";

export function WPQRPage() {
  return (
    <Box sx={{ p: 2 }}>
      <ActionButtons
        buttons={[
          { label: "New", disabled: true },
          { label: "Load", disabled: true },
          { label: "Save", disabled: true },
          { label: "Import", disabled: true },
          { label: "Export", disabled: true },
        ]}
      />
      <Typography variant="h4">WPQR</Typography>
    </Box>
  );
}
