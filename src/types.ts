export interface Parameter {
  Name: string;
  Value: string;
}

export interface Limit {
  LowLimit: number;
  HighLimit: number;
  Parameters?: Parameter[];
}

export interface FillerMetal {
  Brandname: string;
  Manufacturer: string;
  Description: string;
  Designation: string;
  Diameter: number;
}

export interface ShieldingGas {
  Designation: string;
  Brandname: string;
  Manufacturer: string;
  FlowRate: Limit;
  PreflowTime: number;
  PostflowTime: number;
}

export interface TipToWorkDistance {
  LowLimit: number;
  HighLimit: number;
}

export interface FurtherInformation {
  Parameters: Parameter[];
  WeavingType: string;
}

export interface Layer {
  Passes: {
    From: number;
    To: number | null;
  };
  Position: string;
  PassType: string;
  Process: string;
  Current: Limit;
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
  ParentMaterialThickness: number;
  OutsideDiameter: number;
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
