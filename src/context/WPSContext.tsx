import { createContext, useContext, useState, ReactNode } from "react";
import { WPSData } from "../types/wps";

interface WPSContextType {
  wpsData: WPSData;
  updateWPSData: (data: Partial<WPSData>) => void;
  updateGeneralInfo: (
    field: keyof WPSData["generalInfo"],
    value: string
  ) => void;
  updateHeader: (field: keyof WPSData["header"], value: string) => void;
  updateRemarks: (value: string) => void;
  updateWeldingDetails: (
    index: number,
    field: keyof WPSData["weldingDetails"][0],
    value: string
  ) => void;
  updateFillerMetal: (
    index: number,
    field: keyof WPSData["fillerMetal"][0],
    value: string
  ) => void;
  updateShieldingGas: (
    index: number,
    field: keyof WPSData["shieldingGas"][0],
    value: string
  ) => void;
  updateFurtherInfo: (
    index: number,
    field: keyof WPSData["furtherInfo"][0],
    value: string
  ) => void;
  saveWPSData: () => void;
}

const defaultWPSData: WPSData = {
  header: {
    wpsNr: "WPS001",
    revision: "1",
  },
  generalInfo: {
    city: "",
    examiner: "",
    wparNumber: "",
    welderQualification: "",
    weldingProcess: "",
    materialType: "",
    customer: "",
    supervisor: "",
    itemNumber: "",
    drawing: "",
    preparationMethod: "",
    rootPassPrep: "",
    baseMetal1: "",
    baseMetal2: "",
    plateThickness: "",
    outsideDiameter: "",
    preheatTemp: "",
    intermediateTemp: "",
  },
  remarks: "",
  weldingDetails: [
    {
      passFromTo: "",
      weldingPositions: "",
      passType: "",
      process: "",
      fillerMetalDiameter: "",
      weldingCurrent: "",
      arcLengthCorrection: "",
      weldingVoltage: "",
      polarity: "",
      wireFeedSpeed: "",
      travelSpeed: "",
      heatInput: "",
    },
  ],
  fillerMetal: [
    {
      passFromTo: "",
      designation: "",
      brandName: "",
      manufacturer: "",
    },
  ],
  shieldingGas: [
    {
      passFromTo: "",
      designation: "",
      flowRate: "",
      preflowTime: "",
      postflowTime: "",
    },
  ],
  furtherInfo: [
    {
      passFromTo: "",
      parameter: "",
      value: "",
      weavingType: "",
    },
  ],
};

const WPSContext = createContext<WPSContextType | undefined>(undefined);

export function WPSProvider({ children }: { children: ReactNode }) {
  const [wpsData, setWPSData] = useState<WPSData>(defaultWPSData);

  const updateWPSData = (data: Partial<WPSData>) => {
    setWPSData((prev) => ({ ...prev, ...data }));
  };

  const updateGeneralInfo = (
    field: keyof WPSData["generalInfo"],
    value: string
  ) => {
    setWPSData((prev) => ({
      ...prev,
      generalInfo: { ...prev.generalInfo, [field]: value },
    }));
  };

  const updateHeader = (field: keyof WPSData["header"], value: string) => {
    setWPSData((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  };

  const updateRemarks = (value: string) => {
    setWPSData((prev) => ({ ...prev, remarks: value }));
  };

  const updateWeldingDetails = (
    index: number,
    field: keyof WPSData["weldingDetails"][0],
    value: string
  ) => {
    setWPSData((prev) => ({
      ...prev,
      weldingDetails: prev.weldingDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  const updateFillerMetal = (
    index: number,
    field: keyof WPSData["fillerMetal"][0],
    value: string
  ) => {
    setWPSData((prev) => ({
      ...prev,
      fillerMetal: prev.fillerMetal.map((metal, i) =>
        i === index ? { ...metal, [field]: value } : metal
      ),
    }));
  };

  const updateShieldingGas = (
    index: number,
    field: keyof WPSData["shieldingGas"][0],
    value: string
  ) => {
    setWPSData((prev) => ({
      ...prev,
      shieldingGas: prev.shieldingGas.map((gas, i) =>
        i === index ? { ...gas, [field]: value } : gas
      ),
    }));
  };

  const updateFurtherInfo = (
    index: number,
    field: keyof WPSData["furtherInfo"][0],
    value: string
  ) => {
    setWPSData((prev) => ({
      ...prev,
      furtherInfo: prev.furtherInfo.map((info, i) =>
        i === index ? { ...info, [field]: value } : info
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
        updateGeneralInfo,
        updateHeader,
        updateRemarks,
        updateWeldingDetails,
        updateFillerMetal,
        updateShieldingGas,
        updateFurtherInfo,
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
