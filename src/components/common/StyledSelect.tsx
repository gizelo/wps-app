import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 80px;
`;

const SelectButton = styled.div<{ hasValue: boolean }>`
  white-space: nowrap;
  width: 100%;
  height: 22px;
  padding: 4px 8px;
  border: none;
  background: #f2f2f2;
  font-size: 10px;
  cursor: pointer;
  color: ${({ hasValue }) => (hasValue ? "inherit" : "#666")};

  &:hover {
    outline: 1px solid #007bff;
  }

  &:focus {
    outline: 1px solid #007bff;
    background: #f8f9fa;
    color: black;
  }
`;

const Dropdown = styled.div<{
  isOpen: boolean;
  position: { top?: string; bottom?: string };
}>`
  position: absolute;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  max-height: 200px;
  width: fit-content;
  overflow-y: auto;
  ${({ position }) => position.top && `top: ${position.top};`}
  ${({ position }) => position.bottom && `bottom: ${position.bottom};`}
`;

const Option = styled.div<{ isSelected: boolean }>`
  padding: 8px;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? "#e6f3ff" : "transparent")};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f5f5f5;
  }
`;

const Checkbox = styled.input`
  margin: 0;
`;

export interface Option {
  value: string;
  label: string;
}

interface StyledSelectProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: Option[];
  multiple?: boolean;
}

export function StyledSelect({
  value,
  onChange,
  options,
  multiple = false,
}: StyledSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: string;
    bottom?: string;
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateDropdownPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 200; // max-height of dropdown

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDropdownPosition({ bottom: "100%" });
    } else {
      setDropdownPosition({ top: "100%" });
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return "";
    }
    if (Array.isArray(value)) {
      return value
        .map((v) => options.find((opt) => opt.value === v)?.label)
        .join(", ");
    }
    return options.find((opt) => opt.value === value)?.label || "";
  };

  const isOptionSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleButtonClick = () => {
    updateDropdownPosition();
    setIsOpen(!isOpen);
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton
        hasValue={!!value && (!Array.isArray(value) || value.length > 0)}
        onClick={handleButtonClick}
      >
        {getDisplayValue()}
      </SelectButton>
      <Dropdown isOpen={isOpen} position={dropdownPosition}>
        {!multiple && (
          <Option
            key="none"
            isSelected={!value || value === ""}
            onClick={() => handleOptionClick("")}
          >
            None
          </Option>
        )}
        {options.map((option) => (
          <Option
            key={option.value}
            isSelected={isOptionSelected(option.value)}
            onClick={() => handleOptionClick(option.value)}
          >
            {multiple && (
              <Checkbox
                type="checkbox"
                checked={isOptionSelected(option.value)}
                onChange={() => {}}
              />
            )}
            {option.label}
          </Option>
        ))}
      </Dropdown>
    </SelectContainer>
  );
}
