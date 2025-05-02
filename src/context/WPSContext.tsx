import { createContext, useContext, useState, ReactNode } from "react";
import { WPSData } from "../types/wps";

interface WPSContextType {
  wpsData: WPSData;
  updateWPSData: (data: Partial<WPSData>) => void;
  updateLayer: (index: number, data: Partial<WPSData["Layers"][0]>) => void;
  saveWPSData: () => void;
}

const defaultWPSData: WPSData = {
  WPSNumber: "WPS001",
  Revision: "1",
  Place: "",
  WPQR: "WPQR001",
  WelderQualification: "131_P_BW_23_S_t5_PA_ss_nb",
  WeldingProcess: "131",
  SeamType: "P/Stumpfnaht",
  Customer: "MEYER WERFT GmbH",
  Supervisor: "Supervisor Name",
  PartNumber: "PartNr001",
  Drawing: "Drawing Nr 001",
  Examiner: "Examiner Merkle",
  PreparationMethod: "Machining",
  RootPassPreparation: "Brushing",
  FirstParentMaterial: {
    Standard: "EN 10248-1",
    Group: "1.1",
    Designation: "S240GP",
    MaterialNumber: "1.0021",
  },
  SecondParentMaterial: {
    Standard: "EN 10248-1",
    Group: "1.1",
    Designation: "S240GP",
    MaterialNumber: "1.0021",
  },
  ParentMaterialThickness: 5,
  OutsideDiameter: 8,
  PreheatTemperature: "RT",
  IntermediatePassTemperature: "RT",
  JointDesignImage: "",
  WeldBuildupImage: "",
  Layers: [
    {
      Pass: [1],
      Position: "PA",
      PassType: "Root pass",
      Process: "131",
      FillerDiameter: 1.2,
      Current: {
        LowLimit: 110,
        HighLimit: 120,
      },
      Voltage: {
        LowLimit: 17,
        HighLimit: 19,
      },
      Polarity: "DC+",
      WireFeedSpeed: {
        LowLimit: 6.5,
        HighLimit: 7.5,
      },
      TravelSpeed: {
        LowLimit: 50,
        HighLimit: 60,
      },
      HeatInput: {
        LowLimit: 1.5,
        HighLimit: 2.19,
      },
      ArcLengthCorrection: "+6",
      FillerMetal: {
        Standard: "EN 12072",
        Designation: "G/W/P/S 19 12 3 NbSi",
        MaterialNumber: "1.4576",
        CommertialDesignation: "ML 19.12.3 NbSi",
        Manufacturer: "MIGAL.CO",
      },
      ShieldingGas: {
        Standard: "ISO 14175",
        Symbol: "I1",
        Designation: "Ar",
        CommertialDesignation: "Schweißargon spezial",
        Manufacturer: "Messer Group",
        FlowRate: {
          LowLimit: 15,
          HighLimit: 18,
        },
        PreflowTime: 5,
        PostflowTime: 10,
      },
      FurtherInformation: {
        TipToWorkDistance: {
          LowLimit: 8,
          HighLimit: 10,
        },
        WeavingType: "Stringer Pass",
        DropletTransfer: "Dip transfer",
        GasNozzleDiameter: 15,
      },
    },
  ],
  CreatedBy: "Merkle",
  CreationDate: "2013-11-14",
  ApprovedBy: "Fronius",
  ApprovalDate: "2013-11-14",
  ReleasedBy: "Kemppy",
  ReleaseDate: "2013-11-14",
};

const WPSContext = createContext<WPSContextType | undefined>(undefined);

export function WPSProvider({ children }: { children: ReactNode }) {
  const [wpsData, setWPSData] = useState<WPSData>(defaultWPSData);

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
