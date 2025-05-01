import React from "react";
import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { StyledInput } from "./common/StyledInput";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
  white-space: nowrap;
`;

export function GeneralInfo() {
  const { wpsData, updateGeneralInfo } = useWPS();
  const { generalInfo } = wpsData;

  const leftColumnFields = [
    { key: "city", label: "City:" },
    { key: "wparNumber", label: "WPAR-Number:" },
    { key: "welderQualification", label: "Qualification of welder:" },
    { key: "weldingProcess", label: "Welding process (EN ISO 4063):" },
    { key: "materialType", label: "Material/Seam type:" },
    { key: "customer", label: "Customer:" },
    { key: "supervisor", label: "Supervisor (Name):" },
    { key: "itemNumber", label: "Item number:" },
    { key: "drawing", label: "Drawing:" },
  ] as const;

  const rightColumnFields = [
    { key: "examiner", label: "Examiner:" },
    { key: "preparationMethod", label: "Method of Preparation, cleaning:" },
    { key: "rootPassPrep", label: "Preparation for root pass:" },
    { key: "baseMetal1", label: "Base metal 1:" },
    { key: "baseMetal2", label: "Base metal 2:" },
    { key: "plateThickness", label: "Plate thickness:" },
    { key: "outsideDiameter", label: "Outside diameter:" },
    { key: "preheatTemp", label: "Preheat temperature:" },
    { key: "intermediateTemp", label: "Intermediate pass temperature:" },
  ] as const;

  return (
    <Container>
      <InfoGrid>
        {leftColumnFields.map(({ key, label }) => (
          <React.Fragment key={key}>
            <Label>{label}</Label>
            <StyledInput
              value={generalInfo[key]}
              onChange={(value) => updateGeneralInfo(key, value)}
            />
          </React.Fragment>
        ))}
      </InfoGrid>
      <InfoGrid>
        {rightColumnFields.map(({ key, label }) => (
          <React.Fragment key={key}>
            <Label>{label}</Label>
            <StyledInput
              value={generalInfo[key]}
              onChange={(value) => updateGeneralInfo(key, value)}
            />
          </React.Fragment>
        ))}
      </InfoGrid>
    </Container>
  );
}
