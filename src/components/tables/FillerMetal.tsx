import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import styled from "styled-components";
import { fillerGroups } from "../../constants/fillerGroups";
import { fillers } from "../../constants/fillers";
import { RangeEditModal } from "../common/RangeEditModal";

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
  "Designation",
  "Material Number",
  "Commercial Designation",
  "Manufacturer",
];

export function FillerMetal() {
  const { wpsData, updateLayer } = useWPS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Pass:
      layer.Pass.length === 2
        ? `${layer.Pass[0]}-${layer.Pass[1]}`
        : layer.Pass[0].toString(),
    Designation: layer.FillerMetal.Designation,
    "Material Number": layer.FillerMetal.MaterialNumber,
    "Commercial Designation": layer.FillerMetal.CommertialDesignation,
    Manufacturer: layer.FillerMetal.Manufacturer,
  }));

  const handleUpdate = (index: number, field: string) => {
    if (field === "Pass") {
      setSelectedRowIndex(index);
      setIsRangeModalOpen(true);
      return;
    }

    // For other fields, open the selection modal
    setSelectedRowIndex(index);
    setIsModalOpen(true);
  };

  const handleRangeSave = (values: number[]) => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      updatedLayer.Pass = values;
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsRangeModalOpen(false);
    setSelectedRowIndex(null);
  };

  const handleFillerSelect = (filler: Item) => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      updatedLayer.FillerMetal = {
        Designation: filler.Designation as string,
        MaterialNumber: filler.MaterialNumber as string,
        CommertialDesignation: filler.CommertialDesignation as string,
        Manufacturer: filler.Manufacturer as string,
      };
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsModalOpen(false);
  };

  // Create categories from filler groups
  const fillerCategories: Category[] = fillerGroups.map((group) => ({
    id: group.Description,
    label: group.Description,
    children: group.Manufacturers.map((manufacturer) => ({
      id: `${group.Description}-${manufacturer}`,
      label: manufacturer,
    })),
  }));

  // Create items from fillers
  const fillerItems: Item[] = fillers.map((filler) => ({
    id: filler.Designation,
    categoryId: `${filler.Description}-${filler.Manufacturer}`,
    ...filler,
  }));

  const tableColumns = [
    { key: "Designation", label: "Designation" },
    { key: "MaterialNumber", label: "Material Number" },
    { key: "CommertialDesignation", label: "Commercial Designation" },
    { key: "Manufacturer", label: "Manufacturer" },
  ];

  // Custom cell renderer for all fields except Pass
  const customRenderers = {
    Pass: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Pass")}
      >
        {value || "Edit pass"}
      </SelectorButton>
    ),
    Designation: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Designation")}
      >
        {value || "Select filler metal"}
      </SelectorButton>
    ),
    "Material Number": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Material Number")}
      >
        {value || "Select filler metal"}
      </SelectorButton>
    ),
    "Commercial Designation": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Commercial Designation")}
      >
        {value || "Select filler metal"}
      </SelectorButton>
    ),
    Manufacturer: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Manufacturer")}
      >
        {value || "Select filler metal"}
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
      <SelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Filler Metal"
        categories={fillerCategories}
        items={fillerItems}
        selectedId={
          selectedRowIndex !== null
            ? wpsData.Layers[selectedRowIndex].FillerMetal.Designation
            : undefined
        }
        onSelect={handleFillerSelect}
        tableColumns={tableColumns}
      />
      {selectedRowIndex !== null && (
        <RangeEditModal
          isOpen={isRangeModalOpen}
          onClose={() => {
            setIsRangeModalOpen(false);
            setSelectedRowIndex(null);
          }}
          onSave={handleRangeSave}
          initialValues={wpsData.Layers[selectedRowIndex].Pass}
          title="Edit Pass"
          mode="pass"
        />
      )}
    </>
  );
}
