import React, { useState } from "react";
import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { StyledInput } from "./common/StyledInput";
import { SelectionModal, Category, Item } from "./common/SelectionModal";
import { METAL_GROUPS } from "../constants/metalGroups";
import { METALS } from "../constants/metals";
import { users } from "../constants/users";
import { organizations } from "../constants/organizations";
import { collections } from "../constants/collections";
import { StyledSelect } from "./common/StyledSelect";

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

const SelectorButton = styled.div<{ hasValue: boolean }>`
  cursor: pointer;
  padding: 4px;
  background: #f2f2f2;
  color: ${({ hasValue }) => (hasValue ? "inherit" : "#888")};
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    outline: none;
  }
`;

type MetalField = "FirstParentMaterial" | "SecondParentMaterial";

export function GeneralInfo() {
  const { wpsData, updateWPSData } = useWPS();
  const [isMetalModalOpen, setIsMetalModalOpen] = useState(false);
  const [selectedMetalField, setSelectedMetalField] =
    useState<MetalField | null>(null);

  const handleFieldChange = (field: keyof typeof wpsData, value: string) => {
    updateWPSData({ [field]: value } as Partial<typeof wpsData>);
  };

  const handleMetalSelect = (metal: Item) => {
    if (selectedMetalField) {
      const metalString = `${metal.GroupNumber} ${metal.Standard} ${metal.Designation} (${metal.MaterialNumber})`;
      handleFieldChange(selectedMetalField, metalString);
    }
    setIsMetalModalOpen(false);
  };

  const getSelectedMetalId = (field: MetalField) => {
    const value = wpsData[field];
    if (typeof value === "string" && value) {
      return value;
    }
    return undefined;
  };

  const metalCategories: Category[] = METAL_GROUPS.map((group) => ({
    id: group.GroupNumber,
    label: group.GroupNumber,
    description: group.Description,
    children: group.Subgroups?.map((subgroup) => ({
      id: subgroup.GroupNumber,
      label: subgroup.GroupNumber,
      description: subgroup.Description,
    })),
  }));

  const metalItems: Item[] = METALS.map((metal) => ({
    id: `${metal.GroupNumber} ${metal.Standard} ${metal.Designation} (${metal.MaterialNumber})`,
    categoryId: metal.GroupNumber,
    ...metal,
  }));

  const tableColumns = [
    { key: "Standard", label: "Standard" },
    { key: "Designation", label: "Designation" },
    { key: "MaterialNumber", label: "Material Number" },
    { key: "MaterialName", label: "Material Name" },
  ];

  const leftColumnFields = [
    { key: "Location", label: "Location:" },
    { key: "WPQR", label: "WPQR:" },
    { key: "WelderQualification", label: "Qualification of welder:" },
    { key: "WeldingProcess", label: "Welding process (EN ISO 4063):" },
    { key: "SeamType", label: "Material/Seam type:" },
    { key: "Customer", label: "Customer:" },
    { key: "Supervisor", label: "Manufacturer:" },
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

  const renderField = (key: keyof typeof wpsData, label: string) => {
    if (key === "FirstParentMaterial" || key === "SecondParentMaterial") {
      const value =
        typeof wpsData[key] === "string" ? (wpsData[key] as string) : "";
      return (
        <React.Fragment key={key}>
          <Label>{label}</Label>
          <SelectorButton
            hasValue={!!value}
            onClick={() => {
              setSelectedMetalField(key);
              setIsMetalModalOpen(true);
            }}
          >
            {value || "Select metal"}
          </SelectorButton>
        </React.Fragment>
      );
    }

    if (key === "Supervisor") {
      const supervisorOptions = users.map((user) => ({
        value: user.Name,
        label: user.Name,
      }));

      return (
        <React.Fragment key={key}>
          <Label>{label}</Label>
          <StyledSelect
            value={wpsData[key] as string}
            onChange={(value) => handleFieldChange(key, value as string)}
            options={supervisorOptions}
            placeholder="Select supervisor"
          />
        </React.Fragment>
      );
    }

    if (key === "Customer") {
      const customerOptions = organizations.map((org) => ({
        value: org.Alias,
        label: org.Alias,
      }));

      return (
        <React.Fragment key={key}>
          <Label>{label}</Label>
          <StyledSelect
            value={wpsData[key] as string}
            onChange={(value) => handleFieldChange(key, value as string)}
            options={customerOptions}
            placeholder="Select customer"
          />
        </React.Fragment>
      );
    }

    if (key === "Examiner") {
      const examinerOptions = users.map((user) => ({
        value: user.Name,
        label: user.Name,
      }));

      return (
        <React.Fragment key={key}>
          <Label>{label}</Label>
          <StyledSelect
            value={wpsData[key] as string}
            onChange={(value) => handleFieldChange(key, value as string)}
            options={examinerOptions}
            placeholder="Select examiner"
          />
        </React.Fragment>
      );
    }

    if (key === "PreparationMethod") {
      const preparationOptions = collections.PreparationOrCleaningMethod.map(
        (method) => ({
          value: method,
          label: method,
        })
      );

      return (
        <React.Fragment key={key}>
          <Label>{label}</Label>
          <StyledSelect
            value={wpsData[key] as string}
            onChange={(value) => handleFieldChange(key, value as string)}
            options={preparationOptions}
            placeholder="Select preparation method"
          />
        </React.Fragment>
      );
    }

    if (key === "RootPassPreparation") {
      const rootPassOptions = collections.RootPassPreparationMethod.map(
        (method) => ({
          value: method,
          label: method,
        })
      );

      return (
        <React.Fragment key={key}>
          <Label>{label}</Label>
          <StyledSelect
            value={wpsData[key] as string}
            onChange={(value) => handleFieldChange(key, value as string)}
            options={rootPassOptions}
            placeholder="Select root pass preparation"
          />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={key}>
        <Label>{label}</Label>
        <StyledInput
          value={wpsData[key] as string}
          onChange={(value) => handleFieldChange(key, value)}
        />
      </React.Fragment>
    );
  };

  return (
    <Container>
      <InfoGrid>
        {leftColumnFields.map(({ key, label }) => renderField(key, label))}
      </InfoGrid>
      <InfoGrid>
        {rightColumnFields.map(({ key, label }) => renderField(key, label))}
      </InfoGrid>

      <SelectionModal
        isOpen={isMetalModalOpen}
        onClose={() => setIsMetalModalOpen(false)}
        title="Select Metal"
        categories={metalCategories}
        items={metalItems}
        selectedId={
          selectedMetalField
            ? getSelectedMetalId(selectedMetalField)
            : undefined
        }
        onSelect={handleMetalSelect}
        tableColumns={tableColumns}
      />
    </Container>
  );
}
