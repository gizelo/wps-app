export const DEFAULT_LAYER = {
  Passes: [1],
  Position: "",
  PassType: "",
  Process: "",
  Current: {
    LowLimit: 0,
    HighLimit: 0,
  },
  Voltage: {
    LowLimit: 0,
    HighLimit: 0,
  },
  Polarity: "",
  WireFeedSpeed: {
    LowLimit: 0,
    HighLimit: 0,
  },
  TravelSpeed: {
    LowLimit: 0,
    HighLimit: 0,
  },
  HeatInput: {
    LowLimit: 0,
    HighLimit: 0,
  },
  FillerMetal: {
    Brandname: "",
    Manufacturer: "",
    Description: "",
    Designation: "",
    Diameter: 0,
  },
  ShieldingGas: {
    Designation: "",
    Brandname: "",
    Manufacturer: "",
    FlowRate: {
      LowLimit: 0,
      HighLimit: 0,
    },
    PreflowTime: 0,
    PostflowTime: 0,
  },
  FurtherInformation: {
    Parameters: [
      {
        Name: "TipToWorkDistance",
        Value: "0",
      },
      {
        Name: "DropletTransfer",
        Value: "0",
      },
      {
        Name: "GasNozzleDiameter",
        Value: "0",
      },
    ],
    WeavingType: "",
  },
};
