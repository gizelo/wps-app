export interface ParentMaterial {
  Standard: string;
  Group: string;
  Designation: string;
  MaterialNumber: string;
}

export interface Current {
  LowLimit: number;
  HighLimit: number;
}

export interface Voltage {
  LowLimit: number;
  HighLimit: number;
}

export interface WireFeedSpeed {
  LowLimit: number;
  HighLimit: number;
}

export interface TravelSpeed {
  LowLimit: number;
  HighLimit: number;
}

export interface HeatInput {
  LowLimit: number;
  HighLimit: number;
}

export interface FillerMetal {
  Designation: string;
  MaterialNumber: string;
  CommertialDesignation: string;
  Manufacturer: string;
}

export interface FlowRate {
  LowLimit: number;
  HighLimit: number;
}

export interface ShieldingGas {
  Standard: string;
  Symbol: string;
  Designation: string;
  CommertialDesignation: string;
  Manufacturer: string;
  FlowRate: FlowRate;
  PreflowTime: number;
  PostflowTime: number;
}

export interface TipToWorkDistance {
  LowLimit: number;
  HighLimit: number;
}

export interface FurtherInformation {
  TipToWorkDistance: TipToWorkDistance;
  WeavingType: string;
  DropletTransfer: string;
  GasNozzleDiameter: number;
}

export interface Layer {
  Pass: number[];
  Position: string;
  PassType: string;
  Process: string;
  FillerDiameter: number;
  Current: Current;
  Voltage: Voltage;
  Polarity: string;
  WireFeedSpeed: WireFeedSpeed;
  TravelSpeed: TravelSpeed;
  HeatInput: HeatInput;
  ArcLengthCorrection: string;
  FillerMetal: FillerMetal;
  ShieldingGas: ShieldingGas;
  FurtherInformation: FurtherInformation;
}

export interface WPSData {
  WPSNumber: string;
  Revision: string;
  Place: string;
  WPQR: string;
  WelderQualification: string;
  WeldingProcess: string;
  SeamType: string;
  Customer: string;
  Supervisor: string;
  PartNumber: string;
  Drawing: string;
  Examiner: string;
  PreparationMethod: string;
  RootPassPreparation: string;
  FirstParentMaterial: ParentMaterial;
  SecondParentMaterial: ParentMaterial;
  ParentMaterialThickness: number;
  OutsideDiameter: number;
  PreheatTemperature: string;
  IntermediatePassTemperature: string;
  JointDesignImage: string;
  WeldBuildupImage: string;
  Layers: Layer[];
  CreatedBy: string;
  CreationDate: string;
  ApprovedBy: string;
  ApprovalDate: string;
  ReleasedBy: string;
  ReleaseDate: string;
}
