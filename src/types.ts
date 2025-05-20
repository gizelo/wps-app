export interface Parameter {
  Name: string;
  Value: string;
}

export interface Limit {
  firstValue: number;
  secondValue: number;
  mode: string;
}

export interface FillerMetal {
  Brandname: string;
  Manufacturer: string;
  MaterialNumber: string;
  Description: string;
  Standard: string;
  StandardDesignation: string;
  Size: string;
}

export interface ShieldingGas {
  Standard: string;
  Symbol: string;
  NominalComposition: string;
  Brandname: string;
  Manufacturer: string;
  FlowRate: Limit;
  PreflowTime: number | null;
  PostflowTime: number | null;
}

export interface FurtherInformation {
  TipToWorkDistance: Limit;
  DropletTransfer: string;
  GasNozzleDiameter: Limit;
  WeavingType: string;
}

export interface Layer {
  Passes: {
    From: number;
    To: number | null;
  };
  Positions: string;
  PassType: string;
  Process: string;
  Current: {
    firstValue: number;
    secondValue: number;
    mode: string;
    Parameters: Parameter[];
  };
  Voltage: Limit;
  Polarity: string;
  WireFeedSpeed: Limit;
  TravelSpeed: Limit;
  HeatInput: Limit;
  FillerMetal: FillerMetal;
  ShieldingGas: ShieldingGas;
  FurtherInformation: FurtherInformation;
}

export interface WPSData {
  WPSNumber: string;
  Revision: string;
  Caption: string;
  Designation: string;
  Location: string;
  WPQR: string;
  WelderQualification: string;
  WeldingProcess: string;
  SeamType: string;
  Customer: string;
  Manufacturer: string;
  PartNumber: string;
  Drawing: string;
  Examiner: string;
  PreparationMethod: string;
  RootPassPreparation: string;
  FirstParentMaterial: string;
  SecondParentMaterial: string;
  ParentMaterialThickness: number | null;
  OutsideDiameter: number | null;
  PreheatTemperature: string;
  IntermediatePassTemperature: string;
  JointDesignImage: string;
  WeldBuildupImage: string;
  Remarks: string;
  Layers: Layer[];
  CreatedBy: string;
  CreationDate: string;
  ApprovedBy: string;
  ApprovalDate: string;
  ReleasedBy: string;
  ReleaseDate: string;
}
