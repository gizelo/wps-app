import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { RangeEditModal, DisplayMode } from "../common/RangeEditModal";
import styled from "styled-components";
import { LayersModal } from "../LayersModal";

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
  "Passes",
  "Designation",
  "Brandname",
  "Manufacturer",
  "Flow Rate [l/min]",
  "Preflow Time [s]",
  "Postflow Time [s]",
];

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

export function ShieldingGas() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isPassesEditOpen, setIsPassesEditOpen] = useState(false);
  const [editLayerIndex, setEditLayerIndex] = useState<number | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.To !== null && layer.Passes.To !== undefined
        ? `${layer.Passes.From}-${layer.Passes.To}`
        : `${layer.Passes.From}`,
    Designation: layer.ShieldingGas.Designation,
    Brandname: layer.ShieldingGas.Brandname,
    Manufacturer: layer.ShieldingGas.Manufacturer,
    "Flow Rate [l/min]": formatRangeValue(layer.ShieldingGas.FlowRate),
    "Preflow Time [s]": layer.ShieldingGas.PreflowTime.toString(),
    "Postflow Time [s]": layer.ShieldingGas.PostflowTime.toString(),
  }));

  const handleUpdate = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (field === "Passes") {
      setEditLayerIndex(index);
      setIsPassesEditOpen(true);
      return;
    }
    if (field === "Flow Rate [l/min]") {
      setSelectedRowIndex(index);
      setSelectedField(field);
      setIsRangeModalOpen(true);
      return;
    }

    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };
    const updatedShieldingGas = { ...layer.ShieldingGas };

    switch (field) {
      case "Designation":
        updatedShieldingGas.Designation = value as string;
        break;
      case "Brandname":
        updatedShieldingGas.Brandname = value as string;
        break;
      case "Manufacturer":
        updatedShieldingGas.Manufacturer = value as string;
        break;
      case "Preflow Time [s]":
        updatedShieldingGas.PreflowTime =
          typeof value === "string" ? parseInt(value) : value;
        break;
      case "Postflow Time [s]":
        updatedShieldingGas.PostflowTime =
          typeof value === "string" ? parseInt(value) : value;
        break;
    }

    updatedLayer.ShieldingGas = updatedShieldingGas;
    updateLayer(index, updatedLayer);
  };

  const handleRangeSave = (values: {
    firstValue: number;
    secondValue: number;
    mode: string;
  }) => {
    if (selectedRowIndex !== null && selectedField) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };

      if (selectedField === "Flow Rate [l/min]") {
        updatedLayer.ShieldingGas.FlowRate = {
          firstValue: values.firstValue,
          secondValue: values.secondValue,
          mode: values.mode,
        };
      }

      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsRangeModalOpen(false);
    setSelectedField(null);
    setSelectedRowIndex(null);
  };

  const customRenderers = {
    Passes: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Passes", value)}
      >
        {value || "Edit pass"}
      </SelectorButton>
    ),
    "Flow Rate [l/min]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Flow Rate [l/min]", value)}
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
      {selectedRowIndex !== null && selectedField && (
        <RangeEditModal
          isOpen={isRangeModalOpen}
          onClose={() => {
            setIsRangeModalOpen(false);
            setSelectedField(null);
            setSelectedRowIndex(null);
          }}
          onSave={handleRangeSave}
          initialValues={
            selectedField === "Flow Rate [l/min]"
              ? {
                  First:
                    wpsData.Layers[selectedRowIndex].ShieldingGas.FlowRate
                      .firstValue,
                  Second:
                    wpsData.Layers[selectedRowIndex].ShieldingGas.FlowRate
                      .secondValue,
                  Mode: wpsData.Layers[selectedRowIndex].ShieldingGas.FlowRate
                    .mode as DisplayMode,
                }
              : undefined
          }
          title={selectedField}
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
