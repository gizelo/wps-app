import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";

const headers = [
  "Standard",
  "Designation",
  "Material Number",
  "Commercial Designation",
  "Manufacturer",
];

export function FillerMetal() {
  const { wpsData, updateLayer } = useWPS();

  const tableData = wpsData.Layers.map((layer) => ({
    Standard: layer.FillerMetal.Standard,
    Designation: layer.FillerMetal.Designation,
    "Material Number": layer.FillerMetal.MaterialNumber,
    "Commercial Designation": layer.FillerMetal.CommertialDesignation,
    Manufacturer: layer.FillerMetal.Manufacturer,
  }));

  const handleUpdate = (index: number, field: string, value: string) => {
    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };
    const updatedFillerMetal = { ...layer.FillerMetal };

    switch (field) {
      case "Standard":
        updatedFillerMetal.Standard = value;
        break;
      case "Designation":
        updatedFillerMetal.Designation = value;
        break;
      case "Material Number":
        updatedFillerMetal.MaterialNumber = value;
        break;
      case "Commercial Designation":
        updatedFillerMetal.CommertialDesignation = value;
        break;
      case "Manufacturer":
        updatedFillerMetal.Manufacturer = value;
        break;
    }

    updatedLayer.FillerMetal = updatedFillerMetal;
    updateLayer(index, updatedLayer);
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
