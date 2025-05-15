import { useWPS } from "../../context/WPSContext";
import { useState } from "react";
import { RangeEditModal } from "../common/RangeEditModal";
import styled from "styled-components";
import { collections } from "../../constants/collections";
import { StyledSelect } from "../common/StyledSelect";
import { StyledInput } from "../common/StyledInput";
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

interface TableRow {
  Passes: { value: string; rowSpan: number } | { value: string; rowSpan: 0 };
  Parameter: string;
  Value: string;
  "Weaving Type":
    | { value: string; rowSpan: number }
    | { value: string; rowSpan: 0 };
  _layerIndex: number;
  _paramField: string;
}

export function FurtherInfo() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isPassesEditOpen, setIsPassesEditOpen] = useState(false);
  const [editLayerIndex, setEditLayerIndex] = useState<number | null>(null);

  const tableData: TableRow[] = [];
  wpsData.Layers.forEach((layer, layerIdx) => {
    const params = [
      {
        label: "Tip to work distance [mm]",
        value:
          layer.FurtherInformation.Parameters.find(
            (param) => param.Name === "TipToWorkDistance"
          )?.Value || "",
        field: "Tip to Work Distance [mm]",
      },
      {
        label: "Droplet transfer",
        value:
          layer.FurtherInformation.Parameters.find(
            (param) => param.Name === "DropletTransfer"
          )?.Value || "",
        field: "Droplet Transfer",
      },
      {
        label: "Diameter of gasnozzle [mm]",
        value:
          layer.FurtherInformation.Parameters.find(
            (param) => param.Name === "GasNozzleDiameter"
          )?.Value || "",
        field: "Gas Nozzle Diameter [mm]",
      },
    ];
    params.forEach((param, i) => {
      tableData.push({
        Passes:
          i === 0
            ? {
                value:
                  layer.Passes.To !== null && layer.Passes.To !== undefined
                    ? `${layer.Passes.From}-${layer.Passes.To}`
                    : layer.Passes.From.toString(),
                rowSpan: params.length,
              }
            : { value: "", rowSpan: 0 },
        Parameter: param.label,
        Value: param.value,
        "Weaving Type":
          i === 0
            ? {
                value: layer.FurtherInformation.WeavingType || "",
                rowSpan: params.length,
              }
            : { value: "", rowSpan: 0 },
        _layerIndex: layerIdx,
        _paramField: param.field,
      });
    });
  });

  const handleUpdate = (rowIndex: number, field: string, value: string) => {
    const row = tableData[rowIndex];
    const layerIdx = row._layerIndex;
    const paramField = row._paramField;
    const layer = wpsData.Layers[layerIdx];
    const updatedLayer = { ...layer };
    const updatedFurtherInfo = { ...layer.FurtherInformation };

    if (field === "Passes") {
      setEditLayerIndex(layerIdx);
      setIsPassesEditOpen(true);
      return;
    }
    if (paramField === "Tip to Work Distance [mm]") {
      setSelectedRowIndex(layerIdx);
      setSelectedField("Tip to Work Distance [mm]");
      setIsRangeModalOpen(true);
      return;
    }
    if (field === "Weaving Type") {
      updatedFurtherInfo.WeavingType = value;
      updatedLayer.FurtherInformation = updatedFurtherInfo;
      updateLayer(layerIdx, updatedLayer);
      return;
    }
    if (paramField === "Droplet Transfer") {
      const param = updatedFurtherInfo.Parameters.find(
        (p) => p.Name === "DropletTransfer"
      );
      if (param) param.Value = value;
      else
        updatedFurtherInfo.Parameters.push({
          Name: "DropletTransfer",
          Value: value,
        });
    } else if (paramField === "Gas Nozzle Diameter [mm]") {
      const param = updatedFurtherInfo.Parameters.find(
        (p) => p.Name === "GasNozzleDiameter"
      );
      if (param) param.Value = value;
      else
        updatedFurtherInfo.Parameters.push({
          Name: "GasNozzleDiameter",
          Value: value,
        });
    }
    updatedLayer.FurtherInformation = updatedFurtherInfo;
    updateLayer(layerIdx, updatedLayer);
  };

  const handleRangeSave = (values: number[]) => {
    if (selectedRowIndex !== null && selectedField) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      if (selectedField === "Tip to Work Distance [mm]") {
        const updatedFurtherInfo = { ...layer.FurtherInformation };
        updatedFurtherInfo.Parameters.find(
          (param) => param.Name === "TipToWorkDistance"
        )!.Value = `${values[0]}-${values[1]}`;
        updatedLayer.FurtherInformation = updatedFurtherInfo;
      }
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsRangeModalOpen(false);
    setSelectedField(null);
    setSelectedRowIndex(null);
  };

  const tableHeaders = ["Passes", "Parameter", "Value", "Weaving Type"];

  return (
    <>
      <div style={{ width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  style={{
                    border: "1px solid #000",
                    textAlign: "center",
                    padding: "6px",
                    fontWeight: "normal",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.Passes.rowSpan > 0 && (
                  <td
                    rowSpan={row.Passes.rowSpan}
                    style={{
                      border: "1px solid #000",
                      textAlign: "center",
                      padding: "6px",
                      background: "#f2f2f2",
                    }}
                  >
                    <SelectorButton
                      hasValue={!!row.Passes.value}
                      onClick={() =>
                        handleUpdate(rowIndex, "Passes", row.Passes.value)
                      }
                    >
                      {row.Passes.value || "Edit pass"}
                    </SelectorButton>
                  </td>
                )}
                <td
                  style={{
                    border: "1px solid #000",
                    textAlign: "left",
                    padding: "4px 8px",
                  }}
                >
                  {row.Parameter}
                </td>
                <td
                  style={{
                    border: "1px solid #000",
                    textAlign: "center",
                    background: "#f2f2f2",
                  }}
                >
                  {row.Parameter === "Droplet transfer" ? (
                    <StyledSelect
                      value={row.Value || ""}
                      onChange={(newValue) => {
                        if (typeof newValue === "string") {
                          handleUpdate(rowIndex, "Value", newValue);
                        }
                      }}
                      options={collections.DropletTransferType.map((type) => ({
                        value: type,
                        label: type,
                      }))}
                    />
                  ) : row.Parameter === "Tip to work distance [mm]" ? (
                    <SelectorButton
                      hasValue={!!row.Value}
                      onClick={() =>
                        handleUpdate(
                          rowIndex,
                          "Tip to Work Distance [mm]",
                          row.Value
                        )
                      }
                    >
                      {row.Value || "Edit range"}
                    </SelectorButton>
                  ) : (
                    <StyledInput
                      value={row.Value || ""}
                      onChange={(value) =>
                        handleUpdate(rowIndex, "Value", value)
                      }
                      centered
                    />
                  )}
                </td>
                {row["Weaving Type"].rowSpan > 0 && (
                  <td
                    rowSpan={row["Weaving Type"].rowSpan}
                    style={{
                      border: "1px solid #000",
                      textAlign: "center",
                      padding: "6px",
                      background: "#f2f2f2",
                    }}
                  >
                    <StyledInput
                      value={row["Weaving Type"].value || ""}
                      onChange={(value) => {
                        const layerIdx = row._layerIndex;
                        const layer = wpsData.Layers[layerIdx];
                        const updatedLayer = { ...layer };
                        const updatedFurtherInfo = {
                          ...layer.FurtherInformation,
                          WeavingType: value,
                        };
                        updatedLayer.FurtherInformation = updatedFurtherInfo;
                        updateLayer(layerIdx, updatedLayer);
                      }}
                      centered
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isRangeModalOpen && selectedRowIndex !== null && selectedField && (
        <RangeEditModal
          isOpen={isRangeModalOpen}
          onClose={() => {
            setIsRangeModalOpen(false);
            setSelectedField(null);
            setSelectedRowIndex(null);
          }}
          onSave={handleRangeSave}
          initialValues={
            selectedField === "Tip to Work Distance [mm]"
              ? wpsData.Layers[
                  selectedRowIndex
                ].FurtherInformation.Parameters.find(
                  (param) => param.Name === "TipToWorkDistance"
                )
                  ?.Value.split("-")
                  .map(Number)
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
