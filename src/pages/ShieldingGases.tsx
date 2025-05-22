import { Box } from "@mui/material";
import { ActionButtons } from "../components/ActionButtons";

export function ShieldingGasesPage() {
  return (
    <Box>
      <ActionButtons
        buttons={[
          { label: "New", disabled: true },
          { label: "Load", disabled: true },
          { label: "Save", disabled: true },
          { label: "Delete", disabled: true },
          { label: "Import", disabled: true },
          { label: "Export", disabled: true },
        ]}
      />
    </Box>
  );
}
