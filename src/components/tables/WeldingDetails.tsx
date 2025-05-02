import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";

const headers = [
  "Pass",
  "Position",
  "Pass Type",
  "Process",
  "Filler Diameter [mm]",
  "Current [A]",
  "Voltage [V]",
  "Polarity",
  "Wire Feed Speed [m/min]",
  "Travel Speed [cm/min]",
  "Heat Input [kJ/cm]",
];

export function WeldingDetails() {
  const { wpsData, updateLayer } = useWPS();

  const tableData = wpsData.Layers.map((layer) => ({
    Pass: layer.Pass.join(", "),
    Position: layer.Position,
    "Pass Type": layer.PassType,
    Process: layer.Process,
    "Filler Diameter [mm]": layer.FillerDiameter.toString(),
    "Current [A]": `${layer.Current.LowLimit}-${layer.Current.HighLimit}`,
    "Voltage [V]": `${layer.Voltage.LowLimit}-${layer.Voltage.HighLimit}`,
    Polarity: layer.Polarity,
    "Wire Feed Speed [m/min]": `${layer.WireFeedSpeed.LowLimit}-${layer.WireFeedSpeed.HighLimit}`,
    "Travel Speed [cm/min]": `${layer.TravelSpeed.LowLimit}-${layer.TravelSpeed.HighLimit}`,
    "Heat Input [kJ/cm]": `${layer.HeatInput.LowLimit}-${layer.HeatInput.HighLimit}`,
  }));

  const handleUpdate = (index: number, field: string, value: string) => {
    const layer = wpsData.Layers[index];
    const updatedLayer = { ...layer };

    switch (field) {
      case "Pass":
        updatedLayer.Pass = value.split(",").map((p) => parseInt(p.trim()));
        break;
      case "Position":
        updatedLayer.Position = value;
        break;
      case "Pass Type":
        updatedLayer.PassType = value;
        break;
      case "Process":
        updatedLayer.Process = value;
        break;
      case "Filler Diameter [mm]":
        updatedLayer.FillerDiameter = parseFloat(value);
        break;
      case "Current [A]": {
        const [currentLow, currentHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.Current = { LowLimit: currentLow, HighLimit: currentHigh };
        break;
      }
      case "Voltage [V]": {
        const [voltageLow, voltageHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.Voltage = { LowLimit: voltageLow, HighLimit: voltageHigh };
        break;
      }
      case "Polarity":
        updatedLayer.Polarity = value;
        break;
      case "Wire Feed Speed [m/min]": {
        const [wfsLow, wfsHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.WireFeedSpeed = { LowLimit: wfsLow, HighLimit: wfsHigh };
        break;
      }
      case "Travel Speed [cm/min]": {
        const [tsLow, tsHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.TravelSpeed = { LowLimit: tsLow, HighLimit: tsHigh };
        break;
      }
      case "Heat Input [kJ/cm]": {
        const [hiLow, hiHigh] = value
          .split("-")
          .map((v) => parseFloat(v.trim()));
        updatedLayer.HeatInput = { LowLimit: hiLow, HighLimit: hiHigh };
        break;
      }
    }

    updateLayer(index, updatedLayer);
  };

  return (
    <StyledTable headers={headers} data={tableData} onUpdate={handleUpdate} />
  );
}
