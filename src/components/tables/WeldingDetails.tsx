import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WELDING_PROCESSES } from "../../constants/weldingProcesses";
import { WELDING_CATEGORIES } from "../../constants/weldingCategories";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import styled from "styled-components";

const SelectorButton = styled.div<{ hasValue: boolean }>`
  cursor: pointer;
  padding: 4px;
  background: #f2f2f2;
  color: ${({ hasValue }) => (hasValue ? "inherit" : "#888")};
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    outline: none;
  }
`;

const headers = [
  "Pass",
  "Position",
  "Pass Type",
  "Process",
  "Filler Diameter [mm]",
  "Current [A]",
  "Voltage [V]",
  "Polarity",
  "Wire Feed Speed [m/min]",
  "Travel Speed [cm/min]",
  "Heat Input [kJ/cm]",
];

function ProcessSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const processCategories: Category[] = WELDING_CATEGORIES.map((cat) => ({
    id: cat.Code,
    label: cat.Code,
    description: cat.Description,
  }));

  const processItems: Item[] = WELDING_PROCESSES.map((proc) => ({
    id: proc.Code,
    categoryId: proc.CategoryCode,
    Code: proc.Code,
    Description: proc.Description,
  }));

  const tableColumns = [
    { key: "Code", label: "Code" },
    { key: "Description", label: "Description" },
  ];

  const selected = processItems.find((item) => item.Code === value);

  return (
    <>
      <SelectorButton hasValue={!!selected} onClick={() => setIsOpen(true)}>
        {selected ? selected.Code : "Select process"}
      </SelectorButton>
      <SelectionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Process"
        categories={processCategories}
        items={processItems}
        selectedId={value}
        onSelect={(item) => onChange(item.Code as string)}
        tableColumns={tableColumns}
      />
    </>
  );
}

export function WeldingDetails() {
  const { wpsData, updateLayer } = useWPS();

  const tableData = wpsData.Layers.map((layer) => ({
    Pass: layer.Pass.join(", "),
    Position: layer.Position,
    "Pass Type": layer.PassType,
    Process: layer.Process,
    "Filler Diameter [mm]": layer.FillerDiameter.toString(),
    "Current [A]": `${layer.Current.LowLimit}-${layer.Current.HighLimit}`,
    "Voltage [V]": `${layer.Voltage.LowLimit}-${layer.Voltage.HighLimit}`,
    Polarity: layer.Polarity,
    "Wire Feed Speed [m/min]": `${layer.WireFeedSpeed.LowLimit}-${layer.WireFeedSpeed.HighLimit}`,
    "Travel Speed [cm/min]": `${layer.TravelSpeed.LowLimit}-${layer.TravelSpeed.HighLimit}`,
    "Heat Input [kJ/cm]": `${layer.HeatInput.LowLimit}-${layer.HeatInput.HighLimit}`,
  }));

  const handleUpdate = (index: number, field: string, value: string) => {
    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };

    switch (field) {
      case "Pass":
        updatedLayer.Pass = value.split(",").map((p) => parseInt(p.trim()));
        break;
      case "Position":
        updatedLayer.Position = value;
        break;
      case "Pass Type":
        updatedLayer.PassType = value;
        break;
      case "Process":
        updatedLayer.Process = value;
        break;
      case "Filler Diameter [mm]":
        updatedLayer.FillerDiameter = parseFloat(value);
        break;
      case "Current [A]": {
        const [currentLow, currentHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.Current = { LowLimit: currentLow, HighLimit: currentHigh };
        break;
      }
      case "Voltage [V]": {
        const [voltageLow, voltageHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.Voltage = { LowLimit: voltageLow, HighLimit: voltageHigh };
        break;
      }
      case "Polarity":
        updatedLayer.Polarity = value;
        break;
      case "Wire Feed Speed [m/min]": {
        const [wfsLow, wfsHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.WireFeedSpeed = { LowLimit: wfsLow, HighLimit: wfsHigh };
        break;
      }
      case "Travel Speed [cm/min]": {
        const [tsLow, tsHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.TravelSpeed = { LowLimit: tsLow, HighLimit: tsHigh };
        break;
      }
      case "Heat Input [kJ/cm]": {
        const [hiLow, hiHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.HeatInput = { LowLimit: hiLow, HighLimit: hiHigh };
        break;
      }
    }

    updateLayer(index, updatedLayer);
  };

  // Custom cell renderer for Process
  const customRenderers = {
    Process: (value: string, rowIndex: number) => (
      <ProcessSelector
        value={value}
        onChange={(code) => handleUpdate(rowIndex, "Process", code)}
      />
    ),
  };

  return (
    <StyledTable
      headers={headers}
      data={tableData}
      onUpdate={handleUpdate}
      customRenderers={customRenderers}
    />
  );
}
