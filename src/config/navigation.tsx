import {
  Description as DescriptionIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  DevicesOther as DevicesIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { ReactNode } from "react";

export interface NavigationItem {
  segment: string;
  title: string;
  icon?: ReactNode;
  children?: NavigationItem[];
}

export const NAVIGATION: NavigationItem[] = [
  {
    segment: "welding-procedures",
    title: "Welding Procedures",
    icon: <DescriptionIcon />,
    children: [
      {
        segment: "wps",
        title: "WPS",
      },
      {
        segment: "wpqr",
        title: "WPQR",
      },
    ],
  },
  {
    segment: "staff",
    title: "Staff",
    icon: <PeopleIcon />,
    children: [
      {
        segment: "personnel",
        title: "Personnel",
      },
      {
        segment: "users",
        title: "Users",
      },
    ],
  },
  {
    segment: "consumables",
    title: "Consumables",
    icon: <InventoryIcon />,
    children: [
      {
        segment: "filler-metals",
        title: "Filler Metals",
      },
      {
        segment: "shielding-gases",
        title: "Shielding Gases",
      },
    ],
  },
  {
    segment: "organizations",
    title: "Organizations",
    icon: <BusinessIcon />,
    children: [
      {
        segment: "manufacturers",
        title: "Manufacturers",
      },
      {
        segment: "customers",
        title: "Customers",
      },
    ],
  },
  {
    segment: "devices",
    title: "Devices",
    icon: <DevicesIcon />,
    children: [
      {
        segment: "power-sources",
        title: "Power Sources",
      },
      {
        segment: "wire-feeders",
        title: "Wire Feeders",
      },
      {
        segment: "gas-sensors",
        title: "Gas Sensors",
      },
    ],
  },
  {
    segment: "settings",
    title: "Settings",
    icon: <SettingsIcon />,
    children: [
      {
        segment: "general",
        title: "General",
      },
      {
        segment: "development",
        title: "Development",
      },
    ],
  },
];
