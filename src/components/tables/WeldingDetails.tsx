import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WELDING_PROCESSES } from "../../constants/weldingProcesses";
import { WELDING_CATEGORIES } from "../../constants/weldingCategories";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import { RangeEditModal } from "../common/RangeEditModal";
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
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedRangeField, setSelectedRangeField] = useState<string | null>(
    null
  );

  const tableData = wpsData.Layers.map((layer) => ({
    Pass:
      layer.Pass.length === 2
        ? `${layer.Pass[0]}-${layer.Pass[1]}`
        : layer.Pass[0].toString(),
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
        setSelectedRowIndex(index);
        setIsRangeModalOpen(true);
        break;
      case "Position":
        updatedLayer.Position = value;
        break;
      case "Pass Type":
        updatedLayer.PassType = value;
        break;
      case "Process":
        updatedLayer.Process = value;
        updateLayer(index, updatedLayer);
        break;
      case "Filler Diameter [mm]":
        updatedLayer.FillerDiameter = parseFloat(value);
        break;
      case "Current [A]":
      case "Voltage [V]":
      case "Wire Feed Speed [m/min]":
      case "Travel Speed [cm/min]":
      case "Heat Input [kJ/cm]":
        setSelectedRowIndex(index);
        setSelectedRangeField(field);
        setIsRangeModalOpen(true);
        break;
      case "Polarity":
        updatedLayer.Polarity = value;
        break;
    }

    if (field !== "Pass" && !field.includes("[") && field !== "Process") {
      updateLayer(index, updatedLayer);
    }
  };

  const handleRangeSave = (values: number[]) => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };

      if (selectedRangeField) {
        switch (selectedRangeField) {
          case "Current [A]":
            updatedLayer.Current = {
              LowLimit: values[0],
              HighLimit: values[1],
            };
            break;
          case "Voltage [V]":
            updatedLayer.Voltage = {
              LowLimit: values[0],
              HighLimit: values[1],
            };
            break;
          case "Wire Feed Speed [m/min]":
            updatedLayer.WireFeedSpeed = {
              LowLimit: values[0],
              HighLimit: values[1],
            };
            break;
          case "Travel Speed [cm/min]":
            updatedLayer.TravelSpeed = {
              LowLimit: values[0],
              HighLimit: values[1],
            };
            break;
          case "Heat Input [kJ/cm]":
            updatedLayer.HeatInput = {
              LowLimit: values[0],
              HighLimit: values[1],
            };
            break;
        }
      } else {
        updatedLayer.Pass = values;
      }

      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsRangeModalOpen(false);
    setSelectedRangeField(null);
  };

  // Custom cell renderer for Process
  const customRenderers = {
    Process: (value: string, rowIndex: number) => (
      <ProcessSelector
        value={value}
        onChange={(code) => handleUpdate(rowIndex, "Process", code)}
      />
    ),
    Pass: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Pass", value)}
      >
        {value || "Edit pass"}
      </SelectorButton>
    ),
    "Current [A]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Current [A]", value)}
      >
        {value || "Edit range"}
      </SelectorButton>
    ),
    "Voltage [V]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Voltage [V]", value)}
      >
        {value || "Edit range"}
      </SelectorButton>
    ),
    "Wire Feed Speed [m/min]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Wire Feed Speed [m/min]", value)}
      >
        {value || "Edit range"}
      </SelectorButton>
    ),
    "Travel Speed [cm/min]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Travel Speed [cm/min]", value)}
      >
        {value || "Edit range"}
      </SelectorButton>
    ),
    "Heat Input [kJ/cm]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Heat Input [kJ/cm]", value)}
      >
        {value || "Edit range"}
      </SelectorButton>
    ),
  };

  return (
    <>
      <StyledTable
        headers={headers}
        data={tableData}
        onUpdate={handleUpdate}
        customRenderers={customRenderers}
      />
      {selectedRowIndex !== null && (
        <RangeEditModal
          isOpen={isRangeModalOpen}
          onClose={() => {
            setIsRangeModalOpen(false);
            setSelectedRangeField(null);
          }}
          onSave={handleRangeSave}
          initialValues={
            selectedRangeField
              ? [
                  selectedRangeField === "Current [A]"
                    ? wpsData.Layers[selectedRowIndex].Current.LowLimit
                    : selectedRangeField === "Voltage [V]"
                    ? wpsData.Layers[selectedRowIndex].Voltage.LowLimit
                    : selectedRangeField === "Wire Feed Speed [m/min]"
                    ? wpsData.Layers[selectedRowIndex].WireFeedSpeed.LowLimit
                    : selectedRangeField === "Travel Speed [cm/min]"
                    ? wpsData.Layers[selectedRowIndex].TravelSpeed.LowLimit
                    : wpsData.Layers[selectedRowIndex].HeatInput.LowLimit,
                  selectedRangeField === "Current [A]"
                    ? wpsData.Layers[selectedRowIndex].Current.HighLimit
                    : selectedRangeField === "Voltage [V]"
                    ? wpsData.Layers[selectedRowIndex].Voltage.HighLimit
                    : selectedRangeField === "Wire Feed Speed [m/min]"
                    ? wpsData.Layers[selectedRowIndex].WireFeedSpeed.HighLimit
                    : selectedRangeField === "Travel Speed [cm/min]"
                    ? wpsData.Layers[selectedRowIndex].TravelSpeed.HighLimit
                    : wpsData.Layers[selectedRowIndex].HeatInput.HighLimit,
                ]
              : wpsData.Layers[selectedRowIndex].Pass
          }
          title={
            selectedRangeField ? `Edit ${selectedRangeField}` : "Edit Pass"
          }
          mode={selectedRangeField ? "range" : "pass"}
        />
      )}
    </>
  );
}
