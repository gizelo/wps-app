import { createContext, useContext, useState, ReactNode } from "react";
import { WPSData } from "../types/wps";
import { DATA } from "../constants/data";

interface WPSContextType {
  wpsData: WPSData;
  updateWPSData: (data: Partial<WPSData>) => void;
  updateLayer: (index: number, data: Partial<WPSData["Layers"][0]>) => void;
  saveWPSData: () => void;
}

const WPSContext = createContext<WPSContextType | undefined>(undefined);

export function WPSProvider({ children }: { children: ReactNode }) {
  const [wpsData, setWPSData] = useState<WPSData>(DATA);

  const updateWPSData = (data: Partial<WPSData>) => {
    setWPSData((prev) => ({ ...prev, ...data }));
  };

  const updateLayer = (index: number, data: Partial<WPSData["Layers"][0]>) => {
    setWPSData((prev) => ({
      ...prev,
      Layers: prev.Layers.map((layer, i) =>
        i === index ? { ...layer, ...data } : layer
      ),
    }));
  };

  const saveWPSData = () => {
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
  };

  return (
    <WPSContext.Provider
      value={{
        wpsData,
        updateWPSData,
        updateLayer,
        saveWPSData,
      }}
    >
      {children}
    </WPSContext.Provider>
  );
}

export function useWPS() {
  const context = useContext(WPSContext);
  if (context === undefined) {
    throw new Error("useWPS must be used within a WPSProvider");
  }
  return context;
}
