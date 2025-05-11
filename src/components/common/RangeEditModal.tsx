import { useState, useEffect } from "react";
import styled from "styled-components";

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
  min-width: 300px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${(props) => (props.$primary ? "#007bff" : "#f2f2f2")};
  color: ${(props) => (props.$primary ? "white" : "inherit")};

  &:hover {
    background: ${(props) => (props.$primary ? "#0056b3" : "#e6e6e6")};
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 16px;
`;

type EditMode = "range" | "pass";

interface RangeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: number[]) => void;
  initialValues?: number[];
  title: string;
  mode?: EditMode;
  allowNegative?: boolean;
}

export function RangeEditModal({
  isOpen,
  onClose,
  onSave,
  initialValues = [],
  title,
  mode = "range",
  allowNegative = false,
}: RangeEditModalProps) {
  const [value1, setValue1] = useState<string>(
    initialValues[0]?.toString() || ""
  );
  const [value2, setValue2] = useState<string>(
    initialValues[1]?.toString() || ""
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setValue1(initialValues[0]?.toString() || "");
      setValue2(initialValues[1]?.toString() || "");
      setError("");
    }
  }, [isOpen, initialValues]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const validateValue = (
    value: string,
    isSecondValue: boolean = false
  ): boolean => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;

    if (!allowNegative && num < 0) return false;

    if (mode === "pass" && isSecondValue) {
      const firstValue = parseFloat(value1);
      if (!isNaN(firstValue) && num <= firstValue) return false;
    }

    return true;
  };

  const handleValue1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue1(newValue);
    setError("");

    if (mode === "pass" && value2) {
      if (!validateValue(value2, true)) {
        setError("Second pass must be greater than first pass");
      }
    }
  };

  const handleValue2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue2(newValue);
    setError("");

    if (mode === "pass" && !validateValue(newValue, true)) {
      setError("Second pass must be greater than first pass");
    }
  };

  const handleSave = () => {
    if (mode === "range") {
      const lowNum = parseFloat(value1) || 0;
      const highNum = parseFloat(value2) || lowNum || 0;

      if (!allowNegative && (lowNum < 0 || highNum < 0)) {
        setError("Values cannot be negative");
        return;
      }

      onSave([lowNum, highNum]);
    } else {
      // Pass mode
      const pass1Num = parseInt(value1);
      const pass2Num = parseInt(value2);

      if (!isNaN(pass1Num)) {
        if (!isNaN(pass2Num)) {
          if (pass2Num <= pass1Num) {
            setError("Second pass must be greater than first pass");
            return;
          }
          onSave([pass1Num, pass2Num]);
        } else {
          onSave([pass1Num]);
        }
      } else {
        onSave([]);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  const getLabels = () => {
    if (mode === "range") {
      return {
        label1: "Low Limit",
        label2: "High Limit",
        placeholder1: "Enter low limit",
        placeholder2: "Enter high limit",
      };
    }
    return {
      label1: "Pass 1",
      label2: "Pass 2 (Optional)",
      placeholder1: "Enter pass 1",
      placeholder2: "Enter pass 2",
    };
  };

  const { label1, label2, placeholder1, placeholder2 } = getLabels();

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "16px" }}>{title}</h2>
        <InputGroup>
          <InputWrapper>
            <Label>{label1}</Label>
            <Input
              type="number"
              value={value1}
              onChange={handleValue1Change}
              placeholder={placeholder1}
              min={allowNegative ? undefined : "0"}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>{label2}</Label>
            <Input
              type="number"
              value={value2}
              onChange={handleValue2Change}
              placeholder={placeholder2}
              min={allowNegative ? undefined : "0"}
            />
          </InputWrapper>
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button $primary onClick={handleSave}>
            Save
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
