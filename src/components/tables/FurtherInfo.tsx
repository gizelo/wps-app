import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { FurtherInfo as FurtherInfoType } from "../../types/wps";

const headers = ["Pass from-to", "Parameter", "Value", "Weaving type"];

const fieldMap: Record<string, keyof FurtherInfoType> = {
  "Pass from-to": "passFromTo",
  Parameter: "parameter",
  Value: "value",
  "Weaving type": "weavingType",
};

export function FurtherInfo() {
  const { wpsData, updateFurtherInfo } = useWPS();

  const tableData = wpsData.furtherInfo.map((info) => {
    const row: Record<string, string> = {};
    headers.forEach((header) => {
      const field = fieldMap[header];
      row[header] = info[field];
    });
    return row;
  });

  const handleUpdate = (index: number, field: string, value: string) => {
    const mappedField = fieldMap[field];
    if (mappedField) {
      updateFurtherInfo(index, mappedField, value);
    }
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
