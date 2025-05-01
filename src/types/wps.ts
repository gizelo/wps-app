export interface WPSData {
  header: {
    wpsNr: string;
    revision: string;
  };
  generalInfo: {
    city: string;
    examiner: string;
    wparNumber: string;
    welderQualification: string;
    weldingProcess: string;
    materialType: string;
    customer: string;
    supervisor: string;
    itemNumber: string;
    drawing: string;
    preparationMethod: string;
    rootPassPrep: string;
    baseMetal1: string;
    baseMetal2: string;
    plateThickness: string;
    outsideDiameter: string;
    preheatTemp: string;
    intermediateTemp: string;
  };
  remarks: string;
  weldingDetails: WeldingDetail[];
  fillerMetal: FillerMetal[];
  shieldingGas: ShieldingGas[];
  furtherInfo: FurtherInfo[];
}

export interface WeldingDetail {
  passFromTo: string;
  weldingPositions: string;
  passType: string;
  process: string;
  fillerMetalDiameter: string;
  weldingCurrent: string;
  arcLengthCorrection: string;
  weldingVoltage: string;
  polarity: string;
  wireFeedSpeed: string;
  travelSpeed: string;
  heatInput: string;
}

export interface FillerMetal {
  passFromTo: string;
  designation: string;
  brandName: string;
  manufacturer: string;
}

export interface ShieldingGas {
  passFromTo: string;
  designation: string;
  flowRate: string;
  preflowTime: string;
  postflowTime: string;
}

export interface FurtherInfo {
  passFromTo: string;
  parameter: string;
  value: string;
  weavingType: string;
}
