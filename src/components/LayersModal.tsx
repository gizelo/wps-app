import styled from "styled-components";
import { DEFAULT_LAYER } from "../constants/defaultLayer";
import { useWPS } from "../context/WPSContext";
import { useEffect, useState } from "react";
import { Layer } from "../types";
import { StyledInput } from "./common/StyledInput";

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
  width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 14px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const Button = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? "#007bff" : "#f0f0f0")};
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  color: ${(props) => (props.primary ? "white" : "#666")};
  border-radius: 4px;
  font-weight: 600;

  &:hover {
    background: ${(props) => (props.primary ? "#0056b3" : "#e0e0e0")};
  }
`;

const ErrorBox = styled.div`
  border: 1px solid #dc3545;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff8f8;
  color: #dc3545;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

interface LayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleEdit?: boolean;
  layers?: Layer[];
  editIndex?: number;
  onSave?: (passes: { From: number; To: number | null }) => void;
}

export function LayersModal({
  isOpen,
  onClose,
  singleEdit = false,
  layers,
  editIndex,
  onSave,
}: LayersModalProps) {
  const { wpsData, updateWPSData } = useWPS();
  const [localLayers, setLocalLayers] = useState<Layer[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const source =
        singleEdit && layers && typeof editIndex === "number"
          ? [layers[editIndex]]
          : wpsData.Layers || [];
      setLocalLayers(JSON.parse(JSON.stringify(source)));
      setValidationErrors([]);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validateLayers = (layersToValidate: Layer[]): string[] => {
    const errors: string[] = [];

    if (layersToValidate.length === 0) return errors;

    let expectedPass = 1;

    if (singleEdit && typeof editIndex === "number" && editIndex > 0) {
      const prevLayer = wpsData.Layers?.[editIndex - 1];
      if (prevLayer) {
        expectedPass =
          prevLayer.Passes.To !== null && prevLayer.Passes.To !== undefined
            ? prevLayer.Passes.To + 1
            : prevLayer.Passes.From + 1;
      }
    }

    for (let i = 0; i < layersToValidate.length; i++) {
      const { From, To } = layersToValidate[i].Passes;

      if (typeof From !== "number" || isNaN(From)) {
        errors.push(
          `Layer ${i + 1}: 'From' is required and must be a valid number.`
        );
        continue;
      }

      if (To !== null && To !== undefined && String(To).trim() !== "") {
        if (typeof To !== "number" || isNaN(To)) {
          errors.push(`Layer ${i + 1}: 'To' must be a valid number.`);
          continue;
        }

        if (To <= From) {
          errors.push(`Layer ${i + 1}: 'To' must be greater than 'From'.`);
          continue;
        }

        if (From !== expectedPass) {
          errors.push(`Layer ${i + 1}: 'From' should be ${expectedPass}.`);
        }

        expectedPass = To + 1;
      } else {
        if (From !== expectedPass) {
          errors.push(`Layer ${i + 1}: 'From' should be ${expectedPass}.`);
        }

        expectedPass = From + 1;
      }
    }

    return errors;
  };

  const updateLayerPass = (
    idx: number,
    field: "From" | "To",
    value: string
  ) => {
    setLocalLayers((prev) => {
      const updated = [...prev];
      const layer = { ...updated[idx] };
      layer.Passes = {
        ...layer.Passes,
        [field]: value === "" ? null : parseInt(value),
      };
      updated[idx] = layer;
      return updated;
    });
  };

  const handleApply = () => {
    const errors = validateLayers(localLayers);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (singleEdit && onSave) {
      onSave(localLayers[0].Passes);
    } else {
      updateWPSData({ Layers: localLayers });
    }
    onClose();
  };

  const handleAddLayer = (afterIndex: number) => {
    setLocalLayers((prevLayers) => {
      const newLayers = [...prevLayers];
      const prevLayer = newLayers[afterIndex];

      const prevLastPass =
        prevLayer?.Passes.To !== null && prevLayer?.Passes.To !== undefined
          ? prevLayer.Passes.To
          : prevLayer?.Passes.From ?? 0;

      const newLayer = {
        ...DEFAULT_LAYER,
        Passes: { From: prevLastPass + 1, To: null },
      };

      newLayers.splice(afterIndex + 1, 0, newLayer);

      return newLayers;
    });
  };

  const handleDeleteLayer = (index: number) => {
    setLocalLayers((prevLayers) => {
      const newLayers = prevLayers.filter((_, i) => i !== index);

      // Пересчитать from у всех последующих после удаленного
      for (let i = 1; i < newLayers.length; i++) {
        const prev = newLayers[i - 1];
        const prevLast =
          prev.Passes.To !== null && prev.Passes.To !== undefined
            ? prev.Passes.To
            : prev.Passes.From;

        newLayers[i] = {
          ...newLayers[i],
          Passes: {
            ...newLayers[i].Passes,
            From: prevLast + 1,
          },
        };
      }

      return newLayers;
    });
  };

  const moveLayerUp = (index: number) => {
    if (index <= 0) return;
    setLocalLayers((prev) => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const moveLayerDown = (index: number) => {
    if (index >= localLayers.length - 1) return;
    setLocalLayers((prev) => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Layers</Title>
        </ModalHeader>
        <Table>
          <thead>
            <tr>
              <Th rowSpan={2} style={{ textAlign: "center" }}>
                #
              </Th>
              <Th colSpan={2} style={{ textAlign: "center" }}>
                Passes
              </Th>
              {!singleEdit && (
                <Th colSpan={4} rowSpan={2} style={{ textAlign: "center" }}>
                  Actions
                </Th>
              )}
            </tr>
            <tr>
              <Th style={{ textAlign: "center" }}>From</Th>
              <Th style={{ textAlign: "center" }}>To</Th>
            </tr>
          </thead>
          <tbody>
            {localLayers.length === 0 ? (
              <tr>
                <Td
                  colSpan={singleEdit ? 3 : 7}
                  style={{ textAlign: "center" }}
                >
                  <Button primary onClick={() => handleAddLayer(-1)}>
                    Add Layer
                  </Button>
                </Td>
              </tr>
            ) : (
              localLayers.map((layer, index) => {
                const idx =
                  singleEdit && typeof editIndex === "number" ? 0 : index;
                return (
                  <Row key={idx}>
                    <Td style={{ textAlign: "center" }}>{idx + 1}</Td>
                    <Td style={{ textAlign: "center" }}>
                      <StyledInput
                        type="text"
                        value={layer.Passes.From?.toString() || ""}
                        onChange={(value) =>
                          updateLayerPass(idx, "From", value)
                        }
                        width="60px"
                        centered
                      />
                    </Td>
                    <Td style={{ textAlign: "center" }}>
                      <StyledInput
                        type="text"
                        value={layer.Passes.To?.toString() || ""}
                        onChange={(value) => updateLayerPass(idx, "To", value)}
                        width="60px"
                        centered
                      />
                    </Td>
                    {!singleEdit && (
                      <Td
                        style={{
                          textAlign: "center",
                          color: "#007bff",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                        onClick={() => handleAddLayer(idx)}
                      >
                        +
                      </Td>
                    )}
                    {!singleEdit && (
                      <Td
                        style={{
                          textAlign: "center",
                          color: "#dc3545",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                        onClick={() => handleDeleteLayer(idx)}
                      >
                        ×
                      </Td>
                    )}
                    {!singleEdit && (
                      <Td
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => moveLayerUp(idx)}
                      >
                        ↑
                      </Td>
                    )}
                    {!singleEdit && (
                      <Td
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => moveLayerDown(idx)}
                      >
                        ↓
                      </Td>
                    )}
                  </Row>
                );
              })
            )}
          </tbody>
        </Table>
        {validationErrors.length > 0 && (
          <ErrorBox>
            {validationErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </ErrorBox>
        )}
        <ModalFooter>
          <Button primary onClick={handleApply}>
            Apply
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
