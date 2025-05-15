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

interface RangeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: number[]) => void;
  initialValues?: number[];
  title: string;
  allowNegative?: boolean;
}

export function RangeEditModal({
  isOpen,
  onClose,
  onSave,
  initialValues = [],
  title,
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

  const handleSave = () => {
    const lowNum = parseFloat(value1) || 0;
    const highNum = parseFloat(value2) || lowNum || 0;
    if (!allowNegative && (lowNum < 0 || highNum < 0)) {
      setError("Values cannot be negative");
      return;
    }
    onSave([lowNum, highNum]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "16px" }}>{title}</h2>
        <InputGroup>
          <InputWrapper>
            <Label>Low Limit</Label>
            <Input
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter low limit"
              min={allowNegative ? undefined : "0"}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>High Limit</Label>
            <Input
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter high limit"
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
