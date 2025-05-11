import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { RangeEditModal } from "../common/RangeEditModal";
import styled from "styled-components";
import { collections } from "../../constants/collections";
import { StyledSelect } from "../common/StyledSelect";

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
  "Tip to Work Distance [mm]",
  "Weaving Type",
  "Droplet Transfer",
  "Gas Nozzle Diameter [mm]",
];

export function FurtherInfo() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Pass:
      layer.Pass.length === 2
        ? `${layer.Pass[0]}-${layer.Pass[1]}`
        : layer.Pass[0].toString(),
    "Tip to Work Distance [mm]": `${layer.FurtherInformation.TipToWorkDistance.LowLimit}-${layer.FurtherInformation.TipToWorkDistance.HighLimit}`,
    "Weaving Type": layer.FurtherInformation.WeavingType,
    "Droplet Transfer": layer.FurtherInformation.DropletTransfer,
    "Gas Nozzle Diameter [mm]":
      layer.FurtherInformation.GasNozzleDiameter.toString(),
  }));

  const handleUpdate = (index: number, field: string, value: string) => {
    if (field === "Pass" || field === "Tip to Work Distance [mm]") {
      setSelectedRowIndex(index);
      setSelectedField(field);
      setIsRangeModalOpen(true);
      return;
    }

    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };
    const updatedFurtherInfo = { ...layer.FurtherInformation };

    switch (field) {
      case "Weaving Type":
        updatedFurtherInfo.WeavingType = value;
        break;
      case "Droplet Transfer":
        updatedFurtherInfo.DropletTransfer = value;
        break;
      case "Gas Nozzle Diameter [mm]":
        updatedFurtherInfo.GasNozzleDiameter = parseFloat(value);
        break;
    }

    updatedLayer.FurtherInformation = updatedFurtherInfo;
    updateLayer(index, updatedLayer);
  };

  const handleRangeSave = (values: number[]) => {
    if (selectedRowIndex !== null && selectedField) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };

      if (selectedField === "Pass") {
        updatedLayer.Pass = values;
      } else {
        const updatedFurtherInfo = { ...layer.FurtherInformation };
        updatedFurtherInfo.TipToWorkDistance = {
          LowLimit: values[0],
          HighLimit: values[1],
        };
        updatedLayer.FurtherInformation = updatedFurtherInfo;
      }

      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsRangeModalOpen(false);
    setSelectedField(null);
    setSelectedRowIndex(null);
  };

  const customRenderers = {
    Pass: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Pass", value)}
      >
        {value || "Edit pass"}
      </SelectorButton>
    ),
    "Tip to Work Distance [mm]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() =>
          handleUpdate(rowIndex, "Tip to Work Distance [mm]", value)
        }
      >
        {value || "Edit range"}
      </SelectorButton>
    ),
    "Droplet Transfer": (value: string, rowIndex: number) => (
      <StyledSelect
        value={value || ""}
        onChange={(newValue) => {
          if (typeof newValue === "string") {
            handleUpdate(rowIndex, "Droplet Transfer", newValue);
          }
        }}
        options={collections.DropletTransferType.map((type) => ({
          value: type,
          label: type,
        }))}
        placeholder="Select transfer type"
      />
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
            selectedField === "Pass"
              ? wpsData.Layers[selectedRowIndex].Pass
              : [
                  wpsData.Layers[selectedRowIndex].FurtherInformation
                    .TipToWorkDistance.LowLimit,
                  wpsData.Layers[selectedRowIndex].FurtherInformation
                    .TipToWorkDistance.HighLimit,
                ]
          }
          title={
            selectedField === "Pass" ? "Edit Pass" : "Edit Tip to Work Distance"
          }
          mode={selectedField === "Pass" ? "pass" : "range"}
        />
      )}
    </>
  );
}
