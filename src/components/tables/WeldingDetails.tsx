import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WELDING_PROCESSES } from "../../constants/weldingProcesses";
import { WELDING_CATEGORIES } from "../../constants/weldingCategories";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import { RangeEditModal, DisplayMode } from "../common/RangeEditModal";
import styled from "styled-components";
import { StyledSelect } from "../common/StyledSelect";
import { collections } from "../../constants/collections";
import { LayersModal } from "../LayersModal";

const SelectorButton = styled.div<{ hasValue: boolean }>`
  white-space: nowrap;
  height: 22px;
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
  "Passes",
  "Positions",
  "Pass Type",
  "Process",
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
    categoryId: proc.Code.substring(0, 2),
    Code: proc.Code,
    Description: proc.Description,
  }));

  const tableColumns = [
    { key: "Code", label: "Code", centred: true },
    { key: "Description", label: "Description" },
  ];

  const selected = processItems.find((item) => item.Code === value);

  const handleReset = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <>
      <SelectorButton hasValue={!!selected} onClick={() => setIsOpen(true)}>
        {selected ? selected.Code : ""}
      </SelectorButton>
      <SelectionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReset={handleReset}
        title="Processes"
        categories={processCategories}
        items={processItems}
        selectedId={value}
        onSelect={(item) => onChange(item.Code as string)}
        tableColumns={tableColumns}
      />
    </>
  );
}

const formatRangeValue = (limit: {
  firstValue: number;
  secondValue: number;
  mode: string;
}) => {
  switch (limit.mode) {
    case "SingleValue":
      return limit.firstValue.toString();
    case "Range":
      return `${limit.firstValue}-${limit.secondValue}`;
    case "AbsDeviation":
      return `${limit.firstValue} ± ${limit.secondValue}`;
    case "RelDeviation":
      return `${limit.firstValue} ± ${limit.secondValue}%`;
    default:
      return limit.firstValue.toString();
  }
};

export function WeldingDetails() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedRangeField, setSelectedRangeField] = useState<string | null>(
    null
  );
  const [isPassesEditOpen, setIsPassesEditOpen] = useState(false);
  const [editLayerIndex, setEditLayerIndex] = useState<number | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.To !== null && layer.Passes.To !== undefined
        ? `${layer.Passes.From}-${layer.Passes.To}`
        : `${layer.Passes.From}`,
    Positions: layer.Positions,
    "Pass Type": layer.PassType,
    Process: layer.Process,
    "Current [A]": formatRangeValue(layer.Current),
    "Voltage [V]": formatRangeValue(layer.Voltage),
    Polarity: layer.Polarity,
    "Wire Feed Speed [m/min]": formatRangeValue(layer.WireFeedSpeed),
    "Travel Speed [cm/min]": formatRangeValue(layer.TravelSpeed),
    "Heat Input [kJ/cm]": formatRangeValue(layer.HeatInput),
  }));

  const handleUpdate = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };

    switch (field) {
      case "Passes":
        setEditLayerIndex(index);
        setIsPassesEditOpen(true);
        return;
      case "Positions":
        updatedLayer.Positions = Array.isArray(value)
          ? value.join(", ")
          : value;
        break;
      case "Pass Type":
        updatedLayer.PassType = value as string;
        break;
      case "Process":
        updatedLayer.Process = value as string;
        updateLayer(index, updatedLayer);
        return;
      case "Current [A]":
      case "Voltage [V]":
      case "Wire Feed Speed [m/min]":
      case "Travel Speed [cm/min]":
      case "Heat Input [kJ/cm]":
        setSelectedRowIndex(index);
        setSelectedRangeField(field);
        setIsRangeModalOpen(true);
        return;
      case "Polarity":
        updatedLayer.Polarity = value as string;
        break;
    }

    if (field !== "Passes" && !field.includes("[") && field !== "Process") {
      updateLayer(index, updatedLayer);
    }
  };

  const handleRangeSave = (values: {
    firstValue: number;
    secondValue: number;
    mode: string;
  }) => {
    if (selectedRowIndex !== null && selectedRangeField) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };

      switch (selectedRangeField) {
        case "Current [A]":
          updatedLayer.Current = {
            firstValue: values.firstValue,
            secondValue: values.secondValue,
            mode: values.mode,
            Parameters: [],
          };
          break;
        case "Voltage [V]":
          updatedLayer.Voltage = {
            firstValue: values.firstValue,
            secondValue: values.secondValue,
            mode: values.mode,
          };
          break;
        case "Wire Feed Speed [m/min]":
          updatedLayer.WireFeedSpeed = {
            firstValue: values.firstValue,
            secondValue: values.secondValue,
            mode: values.mode,
          };
          break;
        case "Travel Speed [cm/min]":
          updatedLayer.TravelSpeed = {
            firstValue: values.firstValue,
            secondValue: values.secondValue,
            mode: values.mode,
          };
          break;
        case "Heat Input [kJ/cm]":
          updatedLayer.HeatInput = {
            firstValue: values.firstValue,
            secondValue: values.secondValue,
            mode: values.mode,
          };
          break;
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
    Positions: (value: string, rowIndex: number) => (
      <StyledSelect
        value={value ? value.split(", ") : []}
        onChange={(newValue) => handleUpdate(rowIndex, "Positions", newValue)}
        options={collections.WeldingPositions.map((pos) => ({
          value: pos,
          label: pos,
        }))}
        multiple={true}
      />
    ),
    "Pass Type": (value: string, rowIndex: number) => (
      <StyledSelect
        value={value}
        onChange={(newValue) =>
          handleUpdate(rowIndex, "Pass Type", newValue as string)
        }
        options={collections.PassType.map((type) => ({
          value: type,
          label: type,
        }))}
      />
    ),
    Polarity: (value: string, rowIndex: number) => (
      <StyledSelect
        value={value}
        onChange={(newValue) =>
          handleUpdate(rowIndex, "Polarity", newValue as string)
        }
        options={collections.PolarityType.map((type) => ({
          value: type,
          label: type,
        }))}
      />
    ),
    Passes: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Passes", value)}
      >
        {value}
      </SelectorButton>
    ),
    "Current [A]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Current [A]", value)}
      >
        {value}
      </SelectorButton>
    ),
    "Voltage [V]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Voltage [V]", value)}
      >
        {value}
      </SelectorButton>
    ),
    "Wire Feed Speed [m/min]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Wire Feed Speed [m/min]", value)}
      >
        {value}
      </SelectorButton>
    ),
    "Travel Speed [cm/min]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Travel Speed [cm/min]", value)}
      >
        {value}
      </SelectorButton>
    ),
    "Heat Input [kJ/cm]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Heat Input [kJ/cm]", value)}
      >
        {value}
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
      {selectedRowIndex !== null && selectedRangeField && (
        <RangeEditModal
          isOpen={isRangeModalOpen}
          onClose={() => {
            setIsRangeModalOpen(false);
            setSelectedRangeField(null);
          }}
          onSave={handleRangeSave}
          initialValues={{
            First:
              selectedRangeField === "Current [A]"
                ? wpsData.Layers[selectedRowIndex].Current.firstValue
                : selectedRangeField === "Voltage [V]"
                ? wpsData.Layers[selectedRowIndex].Voltage.firstValue
                : selectedRangeField === "Wire Feed Speed [m/min]"
                ? wpsData.Layers[selectedRowIndex].WireFeedSpeed.firstValue
                : selectedRangeField === "Travel Speed [cm/min]"
                ? wpsData.Layers[selectedRowIndex].TravelSpeed.firstValue
                : wpsData.Layers[selectedRowIndex].HeatInput.firstValue,
            Second:
              selectedRangeField === "Current [A]"
                ? wpsData.Layers[selectedRowIndex].Current.secondValue
                : selectedRangeField === "Voltage [V]"
                ? wpsData.Layers[selectedRowIndex].Voltage.secondValue
                : selectedRangeField === "Wire Feed Speed [m/min]"
                ? wpsData.Layers[selectedRowIndex].WireFeedSpeed.secondValue
                : selectedRangeField === "Travel Speed [cm/min]"
                ? wpsData.Layers[selectedRowIndex].TravelSpeed.secondValue
                : wpsData.Layers[selectedRowIndex].HeatInput.secondValue,
            Mode:
              selectedRangeField === "Current [A]"
                ? (wpsData.Layers[selectedRowIndex].Current.mode as DisplayMode)
                : selectedRangeField === "Voltage [V]"
                ? (wpsData.Layers[selectedRowIndex].Voltage.mode as DisplayMode)
                : selectedRangeField === "Wire Feed Speed [m/min]"
                ? (wpsData.Layers[selectedRowIndex].WireFeedSpeed
                    .mode as DisplayMode)
                : selectedRangeField === "Travel Speed [cm/min]"
                ? (wpsData.Layers[selectedRowIndex].TravelSpeed
                    .mode as DisplayMode)
                : (wpsData.Layers[selectedRowIndex].HeatInput
                    .mode as DisplayMode),
          }}
          title={selectedRangeField}
        />
      )}
      {isPassesEditOpen && editLayerIndex !== null && (
        <LayersModal
          isOpen={isPassesEditOpen}
          onClose={() => {
            setIsPassesEditOpen(false);
            setEditLayerIndex(null);
          }}
          singleEdit
          layers={wpsData.Layers}
          editIndex={editLayerIndex}
          onSave={(newPasses) => {
            const updatedLayer = {
              ...wpsData.Layers[editLayerIndex],
              Passes: newPasses,
            };
            updateLayer(editLayerIndex, updatedLayer);
            setIsPassesEditOpen(false);
            setEditLayerIndex(null);
          }}
        />
      )}
    </>
  );
}
