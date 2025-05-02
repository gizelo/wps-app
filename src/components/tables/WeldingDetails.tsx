import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WeldingDetail } from "../../types/wps";

const headers = [
  "Pass from-to",
  "Welding positions (EN ISO 6947)",
  "Pass type",
  "Process",
  "Ø Filler metal [mm]",
  "Welding Current [A]",
  "Welding voltage [V]",
  "Polarity",
  "Wire feed speed [m/min]",
  "Travel speed [cm/min]",
  "Heat input [kJ/cm]",
];

const fieldMap: Record<string, keyof WeldingDetail> = {
  "Pass from-to": "passFromTo",
  "Welding positions (EN ISO 6947)": "weldingPositions",
  "Pass type": "passType",
  Process: "process",
  "Ø Filler metal [mm]": "fillerMetalDiameter",
  "Welding Current [A]": "weldingCurrent",
  "Welding voltage [V]": "weldingVoltage",
  Polarity: "polarity",
  "Wire feed speed [m/min]": "wireFeedSpeed",
  "Travel speed [cm/min]": "travelSpeed",
  "Heat input [kJ/cm]": "heatInput",
};

export function WeldingDetails() {
  const { wpsData, updateWeldingDetails } = useWPS();

  const tableData = wpsData.weldingDetails.map((detail) => {
    const row: Record<string, string> = {};
    headers.forEach((header) => {
      const field = fieldMap[header];
      row[header] = detail[field];
    });
    return row;
  });

  const handleUpdate = (index: number, field: string, value: string) => {
    const mappedField = fieldMap[field];
    if (mappedField) {
      updateWeldingDetails(index, mappedField, value);
    }
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
