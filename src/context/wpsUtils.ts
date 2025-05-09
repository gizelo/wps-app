import { createContext } from "react";
import { WPSData } from "../types/wps";

export interface WPSContextType {
  wpsData: WPSData;
  updateWPSData: (data: Partial<WPSData>) => void;
  updateLayer: (index: number, data: Partial<WPSData["Layers"][0]>) => void;
  saveWPSData: () => void;
}

export const WPSContext = createContext<WPSContextType | undefined>(undefined);

export function saveWPSDataToFile(wpsData: WPSData) {
  const jsonString = JSON.stringify(wpsData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wps-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
