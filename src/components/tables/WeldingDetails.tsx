import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WELDING_PROCESSES } from "../../constants/weldingProcesses";
import { WELDING_CATEGORIES } from "../../constants/weldingCategories";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import { RangeEditModal } from "../common/RangeEditModal";
import styled from "styled-components";
import { StyledSelect } from "../common/StyledSelect";
import { collections } from "../../constants/collections";
import { LayersModal } from "../LayersModal";

const SelectorButton = styled.div<{ hasValue: boolean }>`
  cursor: pointer;
  padding: 4px;
  height: 22px;
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
    "Current [A]": `${layer.Current.LowLimit}-${layer.Current.HighLimit}`,
    "Voltage [V]": `${layer.Voltage.LowLimit}-${layer.Voltage.HighLimit}`,
    Polarity: layer.Polarity,
    "Wire Feed Speed [m/min]": `${layer.WireFeedSpeed.LowLimit}-${layer.WireFeedSpeed.HighLimit}`,
    "Travel Speed [cm/min]": `${layer.TravelSpeed.LowLimit}-${layer.TravelSpeed.HighLimit}`,
    "Heat Input [kJ/cm]": `${layer.HeatInput.LowLimit}-${layer.HeatInput.HighLimit}`,
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
        break;
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
        updatedLayer.Polarity = value as string;
        break;
    }

    if (field !== "Passes" && !field.includes("[") && field !== "Process") {
      updateLayer(index, updatedLayer);
    }
  };

  const handleRangeSave = (
    values: number[] | { From: number; To: number | null }
  ) => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      if (selectedRangeField) {
        switch (selectedRangeField) {
          case "Current [A]":
            updatedLayer.Current = {
              LowLimit: (values as number[])[0],
              HighLimit: (values as number[])[1],
            };
            break;
          case "Voltage [V]":
            updatedLayer.Voltage = {
              LowLimit: (values as number[])[0],
              HighLimit: (values as number[])[1],
            };
            break;
          case "Wire Feed Speed [m/min]":
            updatedLayer.WireFeedSpeed = {
              LowLimit: (values as number[])[0],
              HighLimit: (values as number[])[1],
            };
            break;
          case "Travel Speed [cm/min]":
            updatedLayer.TravelSpeed = {
              LowLimit: (values as number[])[0],
              HighLimit: (values as number[])[1],
            };
            break;
          case "Heat Input [kJ/cm]":
            updatedLayer.HeatInput = {
              LowLimit: (values as number[])[0],
              HighLimit: (values as number[])[1],
            };
            break;
        }
      } else {
        // Passes
        updatedLayer.Passes = values as { From: number; To: number | null };
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
              : undefined
          }
          title={selectedRangeField || "Edit Range"}
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
