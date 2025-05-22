import { Box, Button } from "@mui/material";

interface ActionButton {
  label: string;
  onClick?: () => void;
  variant?: "contained" | "outlined" | "text";
  disabled?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
}

export function ActionButtons({ buttons }: ActionButtonsProps) {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        gap: 1,
        padding: 2,
        backgroundColor: "background.paper",
        position: "sticky",
        top: 60,
        zIndex: 100,
      }}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || "contained"}
          onClick={button.onClick}
          disabled={button.disabled}
          sx={{
            textTransform: "none",
            minWidth: "100px",
          }}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  );
}
