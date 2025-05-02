import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";

const headers = [
  "Tip to Work Distance [mm]",
  "Weaving Type",
  "Droplet Transfer",
  "Gas Nozzle Diameter [mm]",
];

export function FurtherInfo() {
  const { wpsData, updateLayer } = useWPS();

  const tableData = wpsData.Layers.map((layer) => ({
    "Tip to Work Distance [mm]": `${layer.FurtherInformation.TipToWorkDistance.LowLimit}-${layer.FurtherInformation.TipToWorkDistance.HighLimit}`,
    "Weaving Type": layer.FurtherInformation.WeavingType,
    "Droplet Transfer": layer.FurtherInformation.DropletTransfer,
    "Gas Nozzle Diameter [mm]":
      layer.FurtherInformation.GasNozzleDiameter.toString(),
  }));

  const handleUpdate = (index: number, field: string, value: string) => {
    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };
    const updatedFurtherInfo = { ...layer.FurtherInformation };

    switch (field) {
      case "Tip to Work Distance [mm]": {
        const [low, high] = value.split("-").map((v) => parseFloat(v.trim()));
        updatedFurtherInfo.TipToWorkDistance = {
          LowLimit: low,
          HighLimit: high,
        };
        break;
      }
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

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
