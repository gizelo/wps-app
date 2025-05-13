import styled from "styled-components";
import { DEFAULT_LAYER } from "../constants/defaultLayer";
import { useWPS } from "../context/WPSContext";
import { useEffect } from "react";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  padding: 4px;
  color: #666;

  &:hover {
    color: #000;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 4px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #c82333;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background: #f8f9fa;
  font-weight: normal;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Row = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

interface LayersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayersModal({ isOpen, onClose }: LayersModalProps) {
  const { wpsData, updateWPSData } = useWPS();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddLayer = () => {
    const currentLayers = wpsData.Layers || [];
    const updatedLayers = [...currentLayers, DEFAULT_LAYER];
    updateWPSData({ Layers: updatedLayers });
  };

  const handleDeleteLayer = (index: number) => {
    const currentLayers = wpsData.Layers || [];
    const updatedLayers = currentLayers.filter((_, i) => i !== index);
    updateWPSData({ Layers: updatedLayers });
  };

  const formatPasses = (passes: number[] | undefined) => {
    if (!passes || !Array.isArray(passes)) return "";
    return passes.join(", ");
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Layers</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <Table>
          <thead>
            <tr>
              <Th style={{ textAlign: "center" }}>#</Th>
              <Th>Passes</Th>
              <Th>Process</Th>
              <Th>Position</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {(wpsData.Layers || []).map((layer, index) => (
              <Row key={index}>
                <Td style={{ textAlign: "center" }}>{index + 1}</Td>
                <Td>{formatPasses(layer.Passes)}</Td>
                <Td>{layer.Process}</Td>
                <Td>{layer.Position}</Td>
                <Td style={{ textAlign: "center" }}>
                  <DeleteButton onClick={() => handleDeleteLayer(index)}>
                    Delete
                  </DeleteButton>
                </Td>
              </Row>
            ))}
          </tbody>
        </Table>
        <AddButton onClick={handleAddLayer}>Add Layer</AddButton>
      </ModalContent>
    </ModalOverlay>
  );
}
