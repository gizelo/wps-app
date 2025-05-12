import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
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
  "Passes",
  "Designation",
  "Brandname",
  "Manufacturer",
  "Flow Rate [l/min]",
  "Preflow Time [s]",
  "Postflow Time [s]",
];

export function ShieldingGas() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.length === 2
        ? `${layer.Passes[0]}-${layer.Passes[1]}`
        : layer.Passes[0].toString(),
    Designation: layer.ShieldingGas.Designation,
    Brandname: layer.ShieldingGas.Brandname,
    Manufacturer: layer.ShieldingGas.Manufacturer,
    "Flow Rate [l/min]": `${layer.ShieldingGas.FlowRate.LowLimit}-${layer.ShieldingGas.FlowRate.HighLimit}`,
    "Preflow Time [s]": layer.ShieldingGas.PreflowTime.toString(),
    "Postflow Time [s]": layer.ShieldingGas.PostflowTime.toString(),
  }));

  const handleUpdate = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (field === "Passes" || field === "Flow Rate [l/min]") {
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

  const handleRangeSave = (values: number[]) => {
    if (selectedRowIndex !== null && selectedField) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };

      if (selectedField === "Passes") {
        updatedLayer.Passes = values;
      } else {
        const updatedShieldingGas = { ...layer.ShieldingGas };
        updatedShieldingGas.FlowRate = {
          LowLimit: values[0],
          HighLimit: values[1],
        };
        updatedLayer.ShieldingGas = updatedShieldingGas;
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
            selectedField === "Passes"
              ? wpsData.Layers[selectedRowIndex].Passes
              : [
                  wpsData.Layers[selectedRowIndex].ShieldingGas.FlowRate
                    .LowLimit,
                  wpsData.Layers[selectedRowIndex].ShieldingGas.FlowRate
                    .HighLimit,
                ]
          }
          title={selectedField === "Passes" ? "Edit Passes" : "Edit Flow Rate"}
          mode={selectedField === "Passes" ? "pass" : "range"}
        />
      )}
    </>
  );
}
