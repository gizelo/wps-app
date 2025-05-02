import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";

const headers = [
  "Standard",
  "Symbol",
  "Designation",
  "Commercial Designation",
  "Manufacturer",
  "Flow Rate [l/min]",
  "Preflow Time [s]",
  "Postflow Time [s]",
];

export function ShieldingGas() {
  const { wpsData, updateLayer } = useWPS();

  const tableData = wpsData.Layers.map((layer) => ({
    Standard: layer.ShieldingGas.Standard,
    Symbol: layer.ShieldingGas.Symbol,
    Designation: layer.ShieldingGas.Designation,
    "Commercial Designation": layer.ShieldingGas.CommertialDesignation,
    Manufacturer: layer.ShieldingGas.Manufacturer,
    "Flow Rate [l/min]": `${layer.ShieldingGas.FlowRate.LowLimit}-${layer.ShieldingGas.FlowRate.HighLimit}`,
    "Preflow Time [s]": layer.ShieldingGas.PreflowTime.toString(),
    "Postflow Time [s]": layer.ShieldingGas.PostflowTime.toString(),
  }));

  const handleUpdate = (index: number, field: string, value: string) => {
    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };
    const updatedShieldingGas = { ...layer.ShieldingGas };

    switch (field) {
      case "Standard":
        updatedShieldingGas.Standard = value;
        break;
      case "Symbol":
        updatedShieldingGas.Symbol = value;
        break;
      case "Designation":
        updatedShieldingGas.Designation = value;
        break;
      case "Commercial Designation":
        updatedShieldingGas.CommertialDesignation = value;
        break;
      case "Manufacturer":
        updatedShieldingGas.Manufacturer = value;
        break;
      case "Flow Rate [l/min]": {
        const [low, high] = value.split("-").map((v) => parseFloat(v.trim()));
        updatedShieldingGas.FlowRate = { LowLimit: low, HighLimit: high };
        break;
      }
      case "Preflow Time [s]":
        updatedShieldingGas.PreflowTime = parseInt(value);
        break;
      case "Postflow Time [s]":
        updatedShieldingGas.PostflowTime = parseInt(value);
        break;
    }

    updatedLayer.ShieldingGas = updatedShieldingGas;
    updateLayer(index, updatedLayer);
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
