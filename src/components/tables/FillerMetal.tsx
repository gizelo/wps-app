import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import styled from "styled-components";
import { fillerGroups } from "../../constants/fillerGroups";
import { fillers } from "../../constants/fillers";

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
  "Designation",
  "Brandname",
  "Manufacturer",
  "Size [mm]",
];

export function FillerMetal() {
  const { wpsData, updateLayer } = useWPS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.To !== null && layer.Passes.To !== undefined
        ? `${layer.Passes.From}-${layer.Passes.To}`
        : `${layer.Passes.From}`,
    Designation:
      `${layer.FillerMetal.Standard}: ${layer.FillerMetal.StandardDesignation} ${layer.FillerMetal.MaterialNumber}`
        .replace(/: $/, "")
        .replace(/ $/, ""),
    Brandname: layer.FillerMetal.Brandname,
    Manufacturer: layer.FillerMetal.Manufacturer,
    "Size [mm]": layer.FillerMetal.Size,
  }));

  const handleUpdate = (index: number) => {
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
    id: String(`${filler.Brandname} ${filler.Manufacturer}`),
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

  const customRenderers = {
    Designation: (value: string | number, rowIndex: number) => (
      <SelectorButton hasValue={!!value} onClick={() => handleUpdate(rowIndex)}>
        {String(value)}
      </SelectorButton>
    ),
    Brandname: (value: string | number, rowIndex: number) => (
      <SelectorButton hasValue={!!value} onClick={() => handleUpdate(rowIndex)}>
        {String(value)}
      </SelectorButton>
    ),
    Manufacturer: (value: string | number, rowIndex: number) => (
      <SelectorButton hasValue={!!value} onClick={() => handleUpdate(rowIndex)}>
        {String(value)}
      </SelectorButton>
    ),
    "Size [mm]": (value: string | number, rowIndex: number) => (
      <SelectorButton hasValue={!!value} onClick={() => handleUpdate(rowIndex)}>
        {String(value)}
      </SelectorButton>
    ),
  };

  const tableColumns = [
    { key: "Manufacturer", label: "Manufacturer", centred: true },
    { key: "Brandname", label: "Brandname" },
    { key: "Standard", label: "Standard" },
    { key: "StandardDesignation", label: "Designation" },
    { key: "MaterialNumber", label: "Material #", centred: true },
    { key: "Size", label: "Size [mm]", centred: true },
  ];

  return (
    <>
      <StyledTable
        headers={headers}
        data={tableData}
        onUpdate={handleUpdate}
        customRenderers={customRenderers}
        readOnlyColumns={["Passes"]}
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
            ? `${wpsData.Layers[selectedRowIndex].FillerMetal.Brandname} ${wpsData.Layers[selectedRowIndex].FillerMetal.Manufacturer}`
            : undefined
        }
        onSelect={handleFillerSelect}
        tableColumns={tableColumns}
        layerIndex={selectedRowIndex || 0}
        isFillerSelection
      />
    </>
  );
}
