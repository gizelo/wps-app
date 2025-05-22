import { Button, Paper } from "@mui/material";

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
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        display: "flex",
        gap: 1,
        padding: 1,
        borderRadius: 2,
        position: "sticky",
        top: 80,
        zIndex: 100,
        width: "fit-content",
      }}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || "contained"}
          onClick={button.onClick}
          disabled={button.disabled}
        >
          {button.label}
        </Button>
      ))}
    </Paper>
  );
}
