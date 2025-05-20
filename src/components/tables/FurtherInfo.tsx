import { useWPS } from "../../context/WPSContext";
import { useState } from "react";
import { RangeEditModal, DisplayMode } from "../common/RangeEditModal";
import styled from "styled-components";
import { collections } from "../../constants/collections";
import { StyledSelect } from "../common/StyledSelect";
import { StyledInput } from "../common/StyledInput";

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

interface TableRow {
  Passes: { value: string; rowSpan: number } | { value: string; rowSpan: 0 };
  Parameter: string;
  Value: { firstValue: number; secondValue: number; mode: string } | string;
  "Weaving Type":
    | { value: string; rowSpan: number }
    | { value: string; rowSpan: 0 };
  _layerIndex: number;
  _paramField: string;
}

type RangeField = "TipToWorkDistance" | "GasNozzleDiameter";
type SelectField = "DropletTransfer" | "WeavingType";

export function FurtherInfo() {
  const { wpsData, updateLayer } = useWPS();
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<RangeField | null>(null);

  const tableData: TableRow[] = [];
  wpsData.Layers.forEach((layer, layerIdx) => {
    const params = [
      {
        label: "Tip to work distance [mm]",
        value: layer.FurtherInformation.TipToWorkDistance,
        field: "TipToWorkDistance" as RangeField,
      },
      {
        label: "Droplet transfer",
        value: layer.FurtherInformation.DropletTransfer,
        field: "DropletTransfer" as SelectField,
      },
      {
        label: "Diameter of gas nozzle [mm]",
        value: layer.FurtherInformation.GasNozzleDiameter,
        field: "GasNozzleDiameter" as RangeField,
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

  const handleRangeFieldUpdate = (rowIndex: number, field: RangeField) => {
    const row = tableData[rowIndex];
    setSelectedRowIndex(row._layerIndex);
    setSelectedField(field);
    setIsRangeModalOpen(true);
  };

  const handleSelectFieldUpdate = (
    rowIndex: number,
    field: SelectField,
    value: string
  ) => {
    const row = tableData[rowIndex];
    const layer = wpsData.Layers[row._layerIndex];
    const updatedLayer = { ...layer };
    const updatedFurtherInfo = { ...layer.FurtherInformation };

    if (field === "DropletTransfer") {
      updatedFurtherInfo.DropletTransfer = value;
    } else if (field === "WeavingType") {
      updatedFurtherInfo.WeavingType = value;
    }

    updatedLayer.FurtherInformation = updatedFurtherInfo;
    updateLayer(row._layerIndex, updatedLayer);
  };

  const handleRangeSave = (values: {
    firstValue: number;
    secondValue: number;
    mode: DisplayMode;
  }) => {
    if (selectedRowIndex !== null && selectedField) {
      const layer = wpsData.Layers[selectedRowIndex];
      const updatedLayer = { ...layer };
      const updatedFurtherInfo = { ...layer.FurtherInformation };

      updatedFurtherInfo[selectedField] = {
        firstValue: values.firstValue,
        secondValue: values.secondValue,
        mode: values.mode,
      };

      updatedLayer.FurtherInformation = updatedFurtherInfo;
      updateLayer(selectedRowIndex, updatedLayer);
    }
    setIsRangeModalOpen(false);
    setSelectedField(null);
    setSelectedRowIndex(null);
  };

  const formatRangeValue = (value: {
    firstValue: number;
    secondValue: number;
    mode: string;
  }) => {
    switch (value.mode) {
      case "SingleValue":
        return value.firstValue.toString();
      case "Range":
        return `${value.firstValue}-${value.secondValue}`;
      case "AbsDeviation":
        return `${value.firstValue} ± ${value.secondValue}`;
      case "RelDeviation":
        return `${value.firstValue} ± ${value.secondValue}%`;
      default:
        return value.firstValue.toString();
    }
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
                    }}
                  >
                    {row.Passes.value}
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
                      value={row.Value as string}
                      onChange={(newValue) => {
                        if (typeof newValue === "string") {
                          handleSelectFieldUpdate(
                            rowIndex,
                            "DropletTransfer",
                            newValue
                          );
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
                        handleRangeFieldUpdate(rowIndex, "TipToWorkDistance")
                      }
                    >
                      {formatRangeValue(
                        row.Value as {
                          firstValue: number;
                          secondValue: number;
                          mode: string;
                        }
                      )}
                    </SelectorButton>
                  ) : row.Parameter === "Diameter of gas nozzle [mm]" ? (
                    <SelectorButton
                      hasValue={!!row.Value}
                      onClick={() =>
                        handleRangeFieldUpdate(rowIndex, "GasNozzleDiameter")
                      }
                    >
                      {formatRangeValue(
                        row.Value as {
                          firstValue: number;
                          secondValue: number;
                          mode: string;
                        }
                      )}
                    </SelectorButton>
                  ) : (
                    <StyledInput
                      value={row.Value as string}
                      onChange={(value) =>
                        handleSelectFieldUpdate(
                          rowIndex,
                          "DropletTransfer",
                          value
                        )
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
                    <StyledSelect
                      value={row["Weaving Type"].value || ""}
                      onChange={(value) => {
                        if (typeof value === "string") {
                          handleSelectFieldUpdate(
                            rowIndex,
                            "WeavingType",
                            value
                          );
                        }
                      }}
                      options={collections.WeavingType.map((type) => ({
                        value: type,
                        label: type,
                      }))}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRowIndex !== null && selectedField && (
        <RangeEditModal
          isOpen={isRangeModalOpen}
          onClose={() => {
            setIsRangeModalOpen(false);
            setSelectedField(null);
            setSelectedRowIndex(null);
          }}
          onSave={handleRangeSave}
          initialValues={{
            First:
              wpsData.Layers[selectedRowIndex].FurtherInformation[selectedField]
                .firstValue,
            Second:
              wpsData.Layers[selectedRowIndex].FurtherInformation[selectedField]
                .secondValue,
            Mode: wpsData.Layers[selectedRowIndex].FurtherInformation[
              selectedField
            ].mode as DisplayMode,
          }}
          title={
            selectedField === "TipToWorkDistance"
              ? "Tip to Work Distance [mm]"
              : "Gas Nozzle Diameter [mm]"
          }
        />
      )}
    </>
  );
}
