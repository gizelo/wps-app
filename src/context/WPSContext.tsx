import { useContext, useState, ReactNode } from "react";
import { WPSData } from "../types/wps";
import { DATA } from "../constants/data";
import { WPSContext, WPSContextType, saveWPSDataToFile } from "./wpsUtils";

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

  return (
    <WPSContext.Provider
      value={{
        wpsData,
        updateWPSData,
        updateLayer,
        saveWPSData: () => saveWPSDataToFile(wpsData),
      }}
    >
      {children}
    </WPSContext.Provider>
  );
}

export function useWPS(): WPSContextType {
  const context = useContext(WPSContext);
  if (context === undefined) {
    throw new Error("useWPS must be used within a WPSProvider");
  }
  return context;
}
