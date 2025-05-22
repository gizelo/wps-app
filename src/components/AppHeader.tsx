import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NAVIGATION } from "../config/navigation";
import { Link, useNavigate } from "react-router-dom";

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const toggleCategory = (segment: string) => {
    setExpandedCategories((prev) =>
      prev.includes(segment)
        ? prev.filter((item) => item !== segment)
        : [...prev, segment]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const DrawerList = (
    <Box sx={{ width: 250, paddingTop: 8 }}>
      <List>
        {NAVIGATION.map((item) => (
          <Box key={item.segment}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleCategory(item.segment)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
                {item.children &&
                  (expandedCategories.includes(item.segment) ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse
                in={expandedCategories.includes(item.segment)}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.segment} disablePadding>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => handleNavigation(`/${child.segment}`)}
                      >
                        <ListItemText primary={child.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "black",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              marginLeft: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            WPS Maker
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer}>
        {DrawerList}
      </Drawer>
      <Toolbar />
    </>
  );
}
