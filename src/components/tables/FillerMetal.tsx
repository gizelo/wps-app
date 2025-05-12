import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import styled from "styled-components";
import { fillerGroups } from "../../constants/fillerGroups";
import { fillers } from "../../constants/fillers";
import { RangeEditModal } from "../common/RangeEditModal";

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
  "Designation",
  "Diameter",
  "Brandname",
  "Manufacturer",
];

export function FillerMetal() {
  const { wpsData, updateLayer } = useWPS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.length === 2
        ? `${layer.Passes[0]}-${layer.Passes[1]}`
        : layer.Passes[0].toString(),
    Designation: layer.FillerMetal.Designation,
    Diameter: layer.FillerMetal.Diameter.toString(),
    Brandname: layer.FillerMetal.Brandname,
    Manufacturer: layer.FillerMetal.Manufacturer,
  }));

  const handleUpdate = (index: number, field: string) => {
    if (field === "Passes") {
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
      updatedLayer.Passes = values;
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
        Diameter: filler.Diameter as number,
        Brandname: filler.Brandname as string,
        Manufacturer: filler.Manufacturer as string,
        Description: filler.Description as string,
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
        Designation: "",
        Diameter: 0,
        Brandname: "",
        Manufacturer: "",
        Description: "",
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
    id: filler.Designation,
    categoryId: `${filler.Description}-${filler.Manufacturer}`,
    ...filler,
  }));

  const tableColumns = [
    { key: "Designation", label: "Designation" },
    { key: "Diameter", label: "Diameter" },
    { key: "Brandname", label: "Brandname" },
    { key: "Manufacturer", label: "Manufacturer" },
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
    Designation: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Designation")}
      >
        {String(value)}
      </SelectorButton>
    ),
    Diameter: (value: string | number, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Diameter")}
      >
        {value}
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
          initialValues={wpsData.Layers[selectedRowIndex].Passes}
          title="Edit Passes"
          mode="pass"
        />
      )}
    </>
  );
}
