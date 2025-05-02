import React from "react";
import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { StyledInput } from "./common/StyledInput";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 4px;
  column-gap: 16px;
  align-items: center;
`;

const Label = styled.span`
  white-space: nowrap;
`;

export function GeneralInfo() {
  const { wpsData, updateWPSData } = useWPS();

  const handleFieldChange = (field: keyof typeof wpsData, value: string) => {
    updateWPSData({ [field]: value } as Partial<typeof wpsData>);
  };

  const leftColumnFields = [
    { key: "Place", label: "Place:" },
    { key: "WPQR", label: "WPQR:" },
    { key: "WelderQualification", label: "Qualification of welder:" },
    { key: "WeldingProcess", label: "Welding process (EN ISO 4063):" },
    { key: "SeamType", label: "Material/Seam type:" },
    { key: "Customer", label: "Customer:" },
    { key: "Supervisor", label: "Supervisor (Name):" },
    { key: "PartNumber", label: "Part number:" },
    { key: "Drawing", label: "Drawing:" },
  ] as const;

  const rightColumnFields = [
    { key: "Examiner", label: "Examiner:" },
    { key: "PreparationMethod", label: "Method of Preparation, cleaning:" },
    { key: "RootPassPreparation", label: "Preparation for root pass:" },
    { key: "FirstParentMaterial", label: "Base metal 1:" },
    { key: "SecondParentMaterial", label: "Base metal 2:" },
    { key: "ParentMaterialThickness", label: "Plate thickness:" },
    { key: "OutsideDiameter", label: "Outside diameter:" },
    { key: "PreheatTemperature", label: "Preheat temperature:" },
    {
      key: "IntermediatePassTemperature",
      label: "Intermediate pass temperature:",
    },
  ] as const;

  return (
    <Container>
      <InfoGrid>
        {leftColumnFields.map(({ key, label }) => (
          <React.Fragment key={key}>
            <Label>{label}</Label>
            <StyledInput
              value={wpsData[key] as string}
              onChange={(value) => handleFieldChange(key, value)}
            />
          </React.Fragment>
        ))}
      </InfoGrid>
      <InfoGrid>
        {rightColumnFields.map(({ key, label }) => (
          <React.Fragment key={key}>
            <Label>{label}</Label>
            <StyledInput
              value={
                typeof wpsData[key] === "object"
                  ? JSON.stringify(wpsData[key])
                  : (wpsData[key] as string)
              }
              onChange={(value) => handleFieldChange(key, value)}
            />
          </React.Fragment>
        ))}
      </InfoGrid>
    </Container>
  );
}
