import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { fillersDatasheets } from "../../constants/fillersDatasheets";
import { useWPS } from "../../context/WPSContext";
import { FillerMetal } from "../../types";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 210mm;
  height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 12px;
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-right: -10px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2em;
  margin-bottom: 10px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border: 1px solid #b1b1b1;
`;

const Th = styled.th<{ centred?: boolean }>`
  padding: 8px 12px;
  text-align: ${(props) => (props.centred ? "center" : "left")};
  border-bottom: 1px solid #b1b1b1;
  background: #f8f9fa;
  border: 1px solid #b1b1b1;
  width: 50%;
`;

const Td = styled.td<{ centred?: boolean }>`
  padding: 8px 12px;
  border-bottom: 1px solid #b1b1b1;
  text-align: ${(props) => (props.centred ? "center" : "left")};
  border: 1px solid #b1b1b1;
  width: 50%;
`;

const RemarkBox = styled.div`
  background: #fff3cd;
  padding: 15px;
  border: 1px solid #ffeeba;
  border-radius: 5px;
  margin-top: 15px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #b1b1b1;
  margin-top: 14px;
  background: white;
`;

const Button = styled.button<{ primary?: boolean; disabled?: boolean }>`
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.primary ? "transparent" : "#ccc")};
  background: ${(props) => (props.primary ? "#ff9600" : "white")};
  color: ${(props) => (props.primary ? "white" : "inherit")};
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  transition: all 0.2s;
  &:hover {
    background: ${(props) => (props.primary ? "#ab6502" : "#f5f5f5")};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 4px;
  border: 1px solid #b1b1b1;
  border-radius: 4px;
  font-size: 12px;
`;

interface Classification {
  Standard: string;
  Designation: string;
}

interface FillerMetalData {
  Brandname: string;
  Manufacturer: string;
  Classifications: Classification[];
  MaterialNumber: string;
  Description: string;
  BaseMaterials: string[];
  ShieldingGases: {
    [key: string]: string[];
  };
  Dimensions: {
    [key: string]: string[];
  };
  Remarks: string;
}

interface FillerMetalDatasheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandname: string;
  manufacturer: string;
  layerIndex: number;
  onApply: () => void;
}

export function FillerMetalDatasheetModal({
  isOpen,
  onClose,
  brandname,
  manufacturer,
  layerIndex,
  onApply,
}: FillerMetalDatasheetModalProps) {
  const { wpsData, updateLayer } = useWPS();
  const [fillerData, setFillerData] = useState<FillerMetalData | null>(null);
  const [selectedGas, setSelectedGas] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showMaterialNumber, setShowMaterialNumber] = useState(true);
  const [selectedClassification, setSelectedClassification] =
    useState<Classification>({
      Standard: "",
      Designation: "",
    });
  const [tempFillerData, setTempFillerData] = useState<FillerMetal | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Check if current temp data differs from WPS data
  const checkForChanges = useCallback(() => {
    if (!tempFillerData || !fillerData) return false;

    const currentLayer = wpsData.Layers[layerIndex];
    const isEditingCurrentFiller =
      currentLayer.FillerMetal.Brandname === brandname &&
      currentLayer.FillerMetal.Manufacturer === manufacturer;

    // If we're not editing current filler, there are always changes
    if (!isEditingCurrentFiller) return true;

    // Check if any field has changed
    return (
      tempFillerData.Standard !== currentLayer.FillerMetal.Standard ||
      tempFillerData.StandardDesignation !==
        currentLayer.FillerMetal.StandardDesignation ||
      tempFillerData.Size !== currentLayer.FillerMetal.Size ||
      (showMaterialNumber ? tempFillerData.MaterialNumber : "") !==
        currentLayer.FillerMetal.MaterialNumber
    );
  }, [
    tempFillerData,
    fillerData,
    wpsData.Layers,
    layerIndex,
    brandname,
    manufacturer,
    showMaterialNumber,
  ]);

  // Update hasChanges when temp data changes
  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [tempFillerData, showMaterialNumber, checkForChanges]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const data = fillersDatasheets.find(
        (filler) =>
          filler.Brandname === brandname && filler.Manufacturer === manufacturer
      ) as FillerMetalData | undefined;

      if (data) {
        setFillerData(data);
        const currentLayer = wpsData.Layers[layerIndex];
        const process = currentLayer.Process;

        // Check if we're editing the currently selected filler
        const isEditingCurrentFiller =
          currentLayer.FillerMetal.Brandname === brandname &&
          currentLayer.FillerMetal.Manufacturer === manufacturer;

        // Reset all states first
        setSelectedGas("");
        setSelectedSize("");
        setShowMaterialNumber(true);

        // Set default classification
        let defaultClassification;
        if (isEditingCurrentFiller) {
          // Use current classification from WPS if editing current filler
          defaultClassification = {
            Standard: currentLayer.FillerMetal.Standard,
            Designation: currentLayer.FillerMetal.StandardDesignation,
          };
        } else {
          // Use first classification from datasheet for new filler
          defaultClassification = data.Classifications?.[0] || {
            Standard: "",
            Designation: "",
          };
        }
        setSelectedClassification(defaultClassification);

        // Set Material Number visibility based on WPS data
        if (isEditingCurrentFiller) {
          setShowMaterialNumber(!!currentLayer.FillerMetal.MaterialNumber);
        }

        // Initialize temporary filler data with default values
        const initialTempData = {
          Standard: defaultClassification.Standard,
          StandardDesignation: defaultClassification.Designation,
          Size: "",
          Brandname: data.Brandname,
          Manufacturer: data.Manufacturer,
          MaterialNumber: isEditingCurrentFiller
            ? currentLayer.FillerMetal.MaterialNumber
            : data.MaterialNumber,
          Description: data.Description,
        };

        // Find available processes and their sizes
        const availableProcesses = Object.keys(data.Dimensions || {});
        const processWithSizes =
          availableProcesses.find(
            (p) => (data.Dimensions?.[p] || []).length > 0
          ) || availableProcesses[0];

        // Set initial size based on current process or fallback
        const sizes = data.Dimensions?.[process] || [];
        let initialSize = "";

        if (isEditingCurrentFiller && currentLayer.FillerMetal.Size) {
          // Use current size if editing current filler
          initialSize = currentLayer.FillerMetal.Size;
        } else if (sizes.length > 0) {
          // Use first size from current process
          initialSize = sizes[0];
        } else if (processWithSizes && data.Dimensions?.[processWithSizes]) {
          // Use first size from first available process
          initialSize = data.Dimensions[processWithSizes][0];
        }

        setSelectedSize(initialSize);
        initialTempData.Size = initialSize;

        // Set initial gas
        const gases = data.ShieldingGases?.[process] || [];
        if (gases.length) {
          setSelectedGas(gases[0]);
        } else if (
          processWithSizes &&
          data.ShieldingGases?.[processWithSizes]
        ) {
          setSelectedGas(data.ShieldingGases[processWithSizes][0]);
        }

        setTempFillerData(initialTempData);
        setHasChanges(!isEditingCurrentFiller); // Set initial changes state
      }
    } else {
      // Reset all state when modal closes
      setFillerData(null);
      setTempFillerData(null);
      setSelectedGas("");
      setSelectedSize("");
      setShowMaterialNumber(true);
      setSelectedClassification({ Standard: "", Designation: "" });
      setHasChanges(false);
    }
  }, [isOpen, brandname, manufacturer, wpsData.Layers, layerIndex]);

  // Update temporary data when user makes changes
  useEffect(() => {
    if (fillerData && tempFillerData) {
      const updatedTempData = {
        ...tempFillerData,
        Standard: selectedClassification.Standard,
        StandardDesignation: selectedClassification.Designation,
        Size: selectedSize,
        MaterialNumber: showMaterialNumber ? fillerData.MaterialNumber : "",
      };
      setTempFillerData(updatedTempData);
    }
  }, [selectedClassification, selectedSize, showMaterialNumber, fillerData]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleStandardChange = (classification: Classification) => {
    setSelectedClassification(classification);
  };

  const handleMaterialNumberChange = (show: boolean) => {
    setShowMaterialNumber(show);
  };

  const handleApply = () => {
    if (tempFillerData) {
      const layer = wpsData.Layers[layerIndex];
      const updatedLayer = { ...layer };
      updatedLayer.FillerMetal = tempFillerData;
      updateLayer(layerIndex, updatedLayer);
      onApply();
    }
  };

  if (!isOpen || !fillerData) return null;

  const currentLayer = wpsData.Layers[layerIndex];
  const process = currentLayer.Process;
  const gases = fillerData.ShieldingGases?.[process] || [];
  const sizes = fillerData.Dimensions?.[process] || [];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h1>Filler Metal Datasheet</h1>
        </ModalHeader>

        <ScrollableContent>
          <Section>
            <Table>
              <tbody>
                <tr>
                  <Td>
                    <strong>Brandname (Manufacturer):</strong>
                  </Td>
                  <Td>
                    {fillerData.Brandname} ({fillerData.Manufacturer})
                  </Td>
                  <Td>
                    <label>
                      <input type="checkbox" checked={true} disabled />
                    </label>
                  </Td>
                </tr>
                <tr>
                  <Td>
                    <strong>Material Number:</strong>
                  </Td>
                  <Td>{fillerData.MaterialNumber}</Td>
                  <Td>
                    <label>
                      <input
                        type="checkbox"
                        checked={showMaterialNumber}
                        onChange={(e) =>
                          handleMaterialNumberChange(e.target.checked)
                        }
                      />
                    </label>
                  </Td>
                </tr>
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>Classifications</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Standard</Th>
                  <Th>Designation</Th>
                  <Th>Select</Th>
                </tr>
              </thead>
              <tbody>
                {fillerData.Classifications?.map((classification, index) => (
                  <tr key={index}>
                    <Td>{classification.Standard}</Td>
                    <Td>{classification.Designation}</Td>
                    <Td centred>
                      <input
                        type="radio"
                        name="standard"
                        checked={
                          selectedClassification.Standard ===
                          classification.Standard
                        }
                        onChange={() => handleStandardChange(classification)}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>Description</SectionTitle>
            <p>{fillerData.Description}</p>
          </Section>

          <Section>
            <SectionTitle>Base Materials</SectionTitle>
            <p>{fillerData.BaseMaterials?.join(", ") || "None"}</p>
          </Section>

          <Section>
            <SectionTitle>Shielding Gases</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Process</Th>
                  <Th>Gas Group</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td style={{ fontWeight: "bold" }}>{process}</Td>
                  <Td>
                    {gases.length > 0 ? (
                      <Select
                        value={selectedGas}
                        onChange={(e) => setSelectedGas(e.target.value)}
                      >
                        {gases.map((gas: string) => (
                          <option key={gas} value={gas}>
                            {gas}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <p>
                        No shielding gases available for selected{" "}
                        <span style={{ fontWeight: "bold" }}>{process}</span>{" "}
                        process. Gas will be taken from the first available
                        process for this filler metal.
                      </p>
                    )}
                  </Td>
                </tr>
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>Dimensions</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Process</Th>
                  <Th>Size</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td style={{ fontWeight: "bold" }}>{process}</Td>
                  <Td>
                    {sizes.length > 0 ? (
                      <Select
                        value={selectedSize}
                        onChange={(e) => {
                          setSelectedSize(e.target.value);
                        }}
                      >
                        {sizes.map((size: string) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <p>
                        No sizes available for selected{" "}
                        <span style={{ fontWeight: "bold" }}>{process}</span>{" "}
                        process. Size will be taken from the first available
                        process for this filler metal.
                      </p>
                    )}
                  </Td>
                </tr>
              </tbody>
            </Table>
          </Section>

          <Section>
            <SectionTitle>Remarks</SectionTitle>
            <RemarkBox>{fillerData.Remarks}</RemarkBox>
          </Section>
        </ScrollableContent>

        <ModalFooter>
          <Button primary disabled={!hasChanges} onClick={handleApply}>
            Apply
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
