import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { FillerMetal as FillerMetalType } from "../../types/wps";

const headers = ["Pass from-to", "Designation", "Brand-name", "Manufacturer"];

const fieldMap: Record<string, keyof FillerMetalType> = {
  "Pass from-to": "passFromTo",
  Designation: "designation",
  "Brand-name": "brandName",
  Manufacturer: "manufacturer",
};

export function FillerMetal() {
  const { wpsData, updateFillerMetal } = useWPS();

  const tableData = wpsData.fillerMetal.map((metal) => {
    const row: Record<string, string> = {};
    headers.forEach((header) => {
      const field = fieldMap[header];
      row[header] = metal[field];
    });
    return row;
  });

  const handleUpdate = (index: number, field: string, value: string) => {
    const mappedField = fieldMap[field];
    if (mappedField) {
      updateFillerMetal(index, mappedField, value);
    }
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
