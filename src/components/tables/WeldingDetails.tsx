import { useWPS } from "../../context/WPSContext";
import { StyledTable } from "../common/StyledTable";
import { WELDING_PROCESSES } from "../../constants/weldingProcesses";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SelectorWrapper = styled.div`
  position: relative;
`;

const SelectorButton = styled.div<{
  hasValue: boolean;
}>`
  cursor: pointer;
  padding: 4px;
  background: #f2f2f2;

  &:hover {
    outline: 1px solid #007bff;
  }

  color: ${({ hasValue }) => (hasValue ? "inherit" : "#888")};
`;

const DropdownMenu = styled.div`
  position: absolute;
  z-index: 10;
  background: #fff;
  border: 1px solid #ccc;
  min-width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ProcessItem = styled.div<{ hovered: boolean }>`
  padding: 6px;
  background: ${({ hovered }) => (hovered ? "#f0f0f0" : "#fff")};
  border-bottom: 1px solid #eee;
  position: relative;
`;

const SubprocessMenu = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  background: #fff;
  border: 1px solid #ccc;
  min-width: 260px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const SubprocessItem = styled.div`
  padding: 6px;
  cursor: pointer;
  white-space: nowrap;
`;

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
    <SelectorWrapper ref={ref}>
      <SelectorButton hasValue={!!selected} onClick={() => setOpen((o) => !o)}>
        {selected ? selected.Code : <span>Select process</span>}
      </SelectorButton>
      {open && (
        <DropdownMenu>
          {WELDING_PROCESSES.map((proc) => (
            <ProcessItem
              key={proc.Code}
              hovered={hovered === proc.Code}
              onMouseEnter={() => setHovered(proc.Code)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ fontWeight: 500 }}>{proc.Code}</span> -{" "}
              {proc.Description}
              {hovered === proc.Code && (
                <SubprocessMenu>
                  {proc.Subprocesses.map((sub) => (
                    <SubprocessItem
                      key={sub.Code}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(sub.Code);
                        setOpen(false);
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{sub.Code}</span> -{" "}
                      {sub.Description}
                    </SubprocessItem>
                  ))}
                </SubprocessMenu>
              )}
            </ProcessItem>
          ))}
        </DropdownMenu>
      )}
    </SelectorWrapper>
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
