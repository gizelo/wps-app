import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { ShieldingGas as ShieldingGasType } from "../../types/wps";

const headers = [
  "Pass from-to",
  "Designation",
  "Flow rate [l/min]",
  "Preflow time [s]",
  "Postflow time [s]",
];

const fieldMap: Record<string, keyof ShieldingGasType> = {
  "Pass from-to": "passFromTo",
  Designation: "designation",
  "Flow rate [l/min]": "flowRate",
  "Preflow time [s]": "preflowTime",
  "Postflow time [s]": "postflowTime",
};

export function ShieldingGas() {
  const { wpsData, updateShieldingGas } = useWPS();

  const tableData = wpsData.shieldingGas.map((gas) => {
    const row: Record<string, string> = {};
    headers.forEach((header) => {
      const field = fieldMap[header];
      row[header] = gas[field];
    });
    return row;
  });

  const handleUpdate = (index: number, field: string, value: string) => {
    const mappedField = fieldMap[field];
    if (mappedField) {
      updateShieldingGas(index, mappedField, value);
    }
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
