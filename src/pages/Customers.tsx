import { Box } from "@mui/material";
import { ActionButtons } from "../components/ActionButtons";

export function CustomersPage() {
  return (
    <Box>
      <ActionButtons
        buttons={[
          { label: "New", disabled: true },
          { label: "Load", disabled: true },
          { label: "Save", disabled: true },
          { label: "Delete", disabled: true },
        ]}
      />
    </Box>
  );
}
