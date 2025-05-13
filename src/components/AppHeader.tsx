import { useState } from "react";
import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { LayersModal } from "./LayersModal";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #0056b3;
  }
`;

export function AppHeader() {
  const { wpsData } = useWPS();
  const [isLayersModalOpen, setIsLayersModalOpen] = useState(false);

  const handleSave = () => {
    const jsonString = JSON.stringify(wpsData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wps-data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <HeaderContainer>
        <Toolbar>
          <Button onClick={handleSave}>Save JSON</Button>
          <Button
            onClick={() => setIsLayersModalOpen(true)}
            style={{ backgroundColor: "#ededed", color: "black" }}
          >
            Layers ({wpsData.Layers?.length || 0})
          </Button>
        </Toolbar>
      </HeaderContainer>
      <LayersModal
        isOpen={isLayersModalOpen}
        onClose={() => setIsLayersModalOpen(false)}
      />
    </>
  );
}
