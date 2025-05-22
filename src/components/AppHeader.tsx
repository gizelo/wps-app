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
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NAVIGATION } from "../config/navigation";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const getCurrentPageTitle = () => {
    const path = location.pathname.slice(1); // Remove leading slash
    if (!path) return "WPS Maker";

    // Find the page title in navigation
    for (const category of NAVIGATION) {
      if (category.children) {
        const page = category.children.find((child) => child.segment === path);
        if (page) return page.title;
      }
    }
    return "WPS Maker";
  };

  const DrawerList = (
    <Box sx={{ width: 250, paddingTop: 8 }}>
      <List>
        {NAVIGATION.map((item) => (
          <Box key={item.segment}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleCategory(item.segment)}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
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
                  {item.children.map((child) => {
                    const isActive = location.pathname === `/${child.segment}`;
                    return (
                      <ListItem key={child.segment} disablePadding>
                        <ListItemButton
                          sx={{
                            pl: 7,
                            backgroundColor: isActive
                              ? "action.selected"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: isActive
                                ? "action.selected"
                                : "action.hover",
                            },
                          }}
                          onClick={() => handleNavigation(`/${child.segment}`)}
                        >
                          <ListItemText
                            primary={child.title}
                            primaryTypographyProps={{
                              color: isActive ? "primary.main" : "inherit",
                              fontWeight: isActive ? "bold" : "normal",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            )}
            <Divider />
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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
            {getCurrentPageTitle()}
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
