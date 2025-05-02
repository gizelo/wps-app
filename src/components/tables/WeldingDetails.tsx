import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WELDING_PROCESSES } from "../../constants/weldingProcesses";
import { useState, useRef, useEffect } from "react";

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

function ProcessSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const selected = WELDING_PROCESSES.flatMap((p) => p.Subprocesses).find(
    (sp) => sp.Code === value
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        style={{
          cursor: "pointer",
          padding: 4,
          background: "#f2f2f2",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          selected.Code
        ) : (
          <span style={{ color: "#888" }}>Select process</span>
        )}
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            background: "#fff",
            border: "1px solid #ccc",
            minWidth: 320,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {WELDING_PROCESSES.map((proc) => (
            <div
              key={proc.Code}
              onMouseEnter={() => setHovered(proc.Code)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: 6,
                background: hovered === proc.Code ? "#f0f0f0" : "#fff",
                borderBottom: "1px solid #eee",
                position: "relative",
              }}
            >
              <span style={{ fontWeight: 500 }}>{proc.Code}</span> -{" "}
              {proc.Description}
              {hovered === proc.Code && (
                <div
                  style={{
                    position: "absolute",
                    left: "100%",
                    top: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    minWidth: 260,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {proc.Subprocesses.map((sub) => (
                    <div
                      key={sub.Code}
                      style={{
                        padding: 6,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(sub.Code);
                        setOpen(false);
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{sub.Code}</span> -{" "}
                      {sub.Description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  // Custom cell renderer for Process
  const customRenderers = {
    Process: (value: string, rowIndex: number) => (
      <ProcessSelector
        value={value}
        onChange={(code) => handleUpdate(rowIndex, "Process", code)}
      />
    ),
  };

  return (
    <StyledTable
      headers={headers}
      data={tableData}
      onUpdate={handleUpdate}
      customRenderers={customRenderers}
    />
  );
}
