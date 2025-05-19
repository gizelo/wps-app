import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { useState } from "react";
import { RangeEditModal, DisplayMode } from "../common/RangeEditModal";
import styled from "styled-components";
import { LayersModal } from "../LayersModal";
import { SelectionModal, Category, Item } from "../common/SelectionModal";
import { shieldingGasGroups } from "../../constants/shieldingGasGroups";
import { shieldingGases } from "../../constants/shieldingGases";

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

const createGasCategories = (): Category[] => {
  return shieldingGasGroups.flatMap((group) =>
    group.Subgroups.map((subgroup) => ({
      id: subgroup.Symbol,
      label: subgroup.Symbol,
      description: subgroup.Description,
      children: subgroup.Manufacturers.map((manufacturer) => ({
        id: `${subgroup.Symbol}-${manufacturer}`,
        label: manufacturer,
      })),
    }))
  );
};

const createGasItems = (): Item[] => {
  return shieldingGases.map((gas) => ({
    id: `${gas.Manufacturer}-${gas.Brandname}`,
    categoryId: `${gas.Symbol}-${gas.Manufacturer}`,
    Manufacturer: gas.Manufacturer,
    Brandname: gas.Brandname,
    Standard: gas.Standard,
    Symbol: gas.Symbol,
    Composition: gas.NominalComposition,
    ChemicalComposition: gas.ChemicalComposition,
  }));
};

export function ShieldingGas() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isPassesEditOpen, setIsPassesEditOpen] = useState(false);
  const [editLayerIndex, setEditLayerIndex] = useState<number | null>(null);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);

  const tableData = wpsData.Layers.map((layer) => ({
    Passes:
      layer.Passes.To !== null && layer.Passes.To !== undefined
        ? `${layer.Passes.From}-${layer.Passes.To}`
        : `${layer.Passes.From}`,
    Designation:
      [
        layer.ShieldingGas.Standard,
        layer.ShieldingGas.Symbol,
        layer.ShieldingGas.NominalComposition,
      ]
        .filter(Boolean)
        .join(" – ") || "",
    Brandname: layer.ShieldingGas.Brandname,
    Manufacturer: layer.ShieldingGas.Manufacturer,
    "Flow Rate [l/min]": formatRangeValue(layer.ShieldingGas.FlowRate),
    "Preflow Time [s]": layer.ShieldingGas.PreflowTime?.toString() ?? "",
    "Postflow Time [s]": layer.ShieldingGas.PostflowTime?.toString() ?? "",
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
    if (["Designation", "Brandname", "Manufacturer"].includes(field)) {
      setSelectedRowIndex(index);
      setIsGasModalOpen(true);
      return;
    }

    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };
    const updatedShieldingGas = { ...layer.ShieldingGas };
    const numValue =
      typeof value === "string" ? value.trim() : value.toString();

    switch (field) {
      case "Preflow Time [s]":
      case "Postflow Time [s]":
        if (numValue === "") {
          if (field === "Preflow Time [s]") {
            updatedShieldingGas.PreflowTime = null;
          } else {
            updatedShieldingGas.PostflowTime = null;
          }
        } else {
          const parsedValue = parseInt(numValue);
          if (!isNaN(parsedValue)) {
            if (field === "Preflow Time [s]") {
              updatedShieldingGas.PreflowTime = parsedValue;
            } else {
              updatedShieldingGas.PostflowTime = parsedValue;
            }
          }
        }
        break;
    }

    updatedLayer.ShieldingGas = updatedShieldingGas;
    updateLayer(index, updatedLayer);
  };

  const handleGasSelect = (gas: Item) => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      updatedLayer.ShieldingGas = {
        ...updatedLayer.ShieldingGas,
        Standard: String(gas.Standard || ""),
        Symbol: String(gas.Symbol || ""),
        NominalComposition: String(gas.Composition || ""),
        Brandname: String(gas.Brandname || ""),
        Manufacturer: String(gas.Manufacturer || ""),
      };
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsGasModalOpen(false);
  };

  const handleGasReset = () => {
    if (selectedRowIndex !== null) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      updatedLayer.ShieldingGas = {
        ...updatedLayer.ShieldingGas,
        Standard: "",
        Symbol: "",
        NominalComposition: "",
        Brandname: "",
        Manufacturer: "",
      };
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsGasModalOpen(false);
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
        {value}
      </SelectorButton>
    ),
    "Flow Rate [l/min]": (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Flow Rate [l/min]", value)}
      >
        {value}
      </SelectorButton>
    ),
    Designation: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Designation", value)}
      >
        {value}
      </SelectorButton>
    ),
    Brandname: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Brandname", value)}
      >
        {value}
      </SelectorButton>
    ),
    Manufacturer: (value: string, rowIndex: number) => (
      <SelectorButton
        hasValue={!!value}
        onClick={() => handleUpdate(rowIndex, "Manufacturer", value)}
      >
        {value}
      </SelectorButton>
    ),
  };

  const tableColumns = [
    { key: "Manufacturer", label: "Manufacturer", centred: true },
    { key: "Brandname", label: "Brandname" },
    { key: "Standard", label: "Standard" },
    { key: "Symbol", label: "Symbol", centred: true },
    { key: "Composition", label: "Composition" },
  ];

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
      <SelectionModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        onReset={handleGasReset}
        title="Shielding Gases"
        categories={createGasCategories()}
        items={createGasItems()}
        selectedId={
          selectedRowIndex !== null
            ? `${wpsData.Layers[selectedRowIndex].ShieldingGas.Manufacturer}-${wpsData.Layers[selectedRowIndex].ShieldingGas.Brandname}`
            : undefined
        }
        onSelect={handleGasSelect}
        tableColumns={tableColumns}
        showChemicalComposition
      />
    </>
  );
}
