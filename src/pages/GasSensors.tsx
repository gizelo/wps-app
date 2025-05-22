import { Box, Typography } from "@mui/material";
import { ActionButtons } from "../components/ActionButtons";

export function GasSensorsPage() {
  return (
    <Box sx={{ p: 2 }}>
      <ActionButtons
        buttons={[
          { label: "New", disabled: true },
          { label: "Load", disabled: true },
          { label: "Save", disabled: true },
          { label: "Delete", disabled: true },
        ]}
      />
      <Typography variant="h4">Gas Sensors</Typography>
    </Box>
  );
}
