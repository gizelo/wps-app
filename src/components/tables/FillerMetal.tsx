import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import styled from "styled-components";
import { fillerGroups } from "../../constants/fillerGroups";
import { fillers } from "../../constants/fillers";
import { LayersModal } from "../LayersModal";

const SelectorButton = styled.div<{ hasValue: boolean }>`
  white-space: nowrap;
  height: 20px;
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
  "Standard Designation",
  "Size",
  "Brandname",
  "Manufacturer",
  "Material Number",
  "Description",
  "Standard",
];

export function FillerMetal() {
  const { wpsData, updateLayer } = useWPS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isPassesEditOpen, setIsPassesEditOpen] = useState(false);
  const [editLayerIndex, setEditLayerIndex] = useState<number | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.To !== null && layer.Passes.To !== undefined
        ? `${layer.Passes.From}-${layer.Passes.To}`
        : `${layer.Passes.From}`,
    "Standard Designation": layer.FillerMetal.StandardDesignation,
    Size: layer.FillerMetal.Size,
    Brandname: layer.FillerMetal.Brandname,
    Manufacturer: layer.FillerMetal.Manufacturer,
    "Material Number": layer.FillerMetal.MaterialNumber,
    Description: layer.FillerMetal.Description,
    Standard: layer.FillerMetal.Standard,
  }));

  const handleUpdate = (index: number, field: string) => {
    if (field === "Passes") {
      setEditLayerIndex(index);
      setIsPassesEditOpen(true);
      return;
    }

    setSelectedRowIndex(index);
    setIsModalOpen(true);
  };

  const handleFillerSelect = (filler: Item) => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      updatedLayer.FillerMetal = {
        StandardDesignation: String(filler.StandardDesignation || ""),
        Size: String(filler.Size || ""),
        Brandname: String(filler.Brandname || ""),
        Manufacturer: String(filler.Manufacturer || ""),
        MaterialNumber: String(filler.MaterialNumber || ""),
        Description: String(filler.Description || ""),
        Standard: String(filler.Standard || ""),
      };
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsModalOpen(false);
  };

  const handleReset = () => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      updatedLayer.FillerMetal = {
        StandardDesignation: "",
        Size: "",
        Brandname: "",
        Manufacturer: "",
        MaterialNumber: "",
        Description: "",
        Standard: "",
      };
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsModalOpen(false);
    setSelectedRowIndex(null);
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
    id: String(filler.StandardDesignation || ""),
    categoryId: `${String(filler.Description || "")}-${String(
      filler.Manufacturer || ""
    )}`,
    Brandname: String(filler.Brandname || ""),
    Manufacturer: String(filler.Manufacturer || ""),
    MaterialNumber: String(filler.MaterialNumber || ""),
    Description: String(filler.Description || ""),
    Standard: String(filler.Standard || ""),
    StandardDesignation: String(filler.StandardDesignation || ""),
    Size: String(filler.Size || ""),
  }));

  const tableColumns = [
    { key: "StandardDesignation", label: "Standard Designation" },
    { key: "Size", label: "Size", centred: true },
    { key: "Brandname", label: "Brandname" },
    { key: "Manufacturer", label: "Manufacturer", centred: true },
    { key: "MaterialNumber", label: "Material Number", centred: true },
    { key: "Description", label: "Description" },
    { key: "Standard", label: "Standard" },
  ];

  // Custom cell renderer for all fields except Passes
  const customRenderers = {
    Passes: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Passes")}
      >
        {String(value)}
      </SelectorButton>
    ),
    "Standard Designation": (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Standard Designation")}
      >
        {String(value)}
      </SelectorButton>
    ),
    Size: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Size")}
      >
        {String(value)}
      </SelectorButton>
    ),
    Brandname: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Brandname")}
      >
        {String(value)}
      </SelectorButton>
    ),
    Manufacturer: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Manufacturer")}
      >
        {String(value)}
      </SelectorButton>
    ),
    "Material Number": (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Material Number")}
      >
        {String(value)}
      </SelectorButton>
    ),
    Description: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Description")}
      >
        {String(value)}
      </SelectorButton>
    ),
    Standard: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Standard")}
      >
        {String(value)}
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
        onReset={handleReset}
        title="Filler Metals"
        categories={fillerCategories}
        items={fillerItems}
        selectedId={
          selectedRowIndex !== null
            ? wpsData.Layers[selectedRowIndex].FillerMetal.StandardDesignation
            : undefined
        }
        onSelect={handleFillerSelect}
        tableColumns={tableColumns}
      />
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
