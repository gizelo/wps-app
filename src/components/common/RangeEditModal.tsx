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
  min-width: 600px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  align-items: center;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const CheckboxWrapper = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 9px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${(props) => (props.$disabled ? "#f5f5f5" : "white")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
`;

const Checkbox = styled.input<{ $disabled?: boolean }>`
  margin: 0;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
`;

const CheckboxLabel = styled.label<{ $disabled?: boolean }>`
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  user-select: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
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

export type DisplayMode =
  | "None"
  | "SingleValue"
  | "Range"
  | "AbsDeviation"
  | "RelDeviation";

interface RangeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: {
    firstValue: number;
    secondValue: number;
    mode: DisplayMode;
  }) => void;
  initialValues?: { First: number; Second?: number; Mode?: DisplayMode };
  title: string;
}

const MIN_VALUE = 1;
const MAX_VALUE = 999;

const modeToOperator = {
  None: "",
  SingleValue: "",
  Range: "-",
  AbsDeviation: "±",
  RelDeviation: "±",
} as const;

const modeToRelative = {
  None: false,
  SingleValue: false,
  Range: false,
  AbsDeviation: false,
  RelDeviation: true,
} as const;

export function RangeEditModal({
  isOpen,
  onClose,
  onSave,
  initialValues = { First: 0, Mode: "SingleValue" },
  title,
}: RangeEditModalProps) {
  const [firstValue, setFirstValue] = useState<string>(
    initialValues.First?.toString() || ""
  );
  const [secondValue, setSecondValue] = useState<string>(
    initialValues.Second?.toString() || ""
  );
  const [operator, setOperator] = useState<string>(
    initialValues.Mode ? modeToOperator[initialValues.Mode] : ""
  );
  const [relativeDeviation, setRelativeDeviation] = useState<boolean>(
    initialValues.Mode ? modeToRelative[initialValues.Mode] : false
  );
  const [error, setError] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    initialValues.Mode || "SingleValue"
  );

  useEffect(() => {
    if (isOpen) {
      setFirstValue(initialValues.First?.toString() || "");
      setSecondValue(initialValues.Second?.toString() || "");
      const initialMode = initialValues.Mode || "SingleValue";
      setOperator(modeToOperator[initialMode]);
      setRelativeDeviation(modeToRelative[initialMode]);
      setError("");
      setDisplayMode(initialMode);
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

  const updateDisplayMode = () => {
    const first = parseFloat(firstValue) || 0;
    const second = parseFloat(secondValue) || 0;

    let mode: DisplayMode = "None";
    if (first === 0) {
      mode = "None";
    } else if (!operator) {
      mode = "SingleValue";
    } else if (operator === "-") {
      mode = second !== 0 ? "Range" : "SingleValue";
    } else if (operator === "±") {
      mode =
        second !== 0
          ? relativeDeviation
            ? "RelDeviation"
            : "AbsDeviation"
          : "SingleValue";
    }

    setDisplayMode(mode);
  };

  useEffect(() => {
    updateDisplayMode();
  }, [firstValue, secondValue, operator, relativeDeviation]);

  const validateValues = () => {
    const first = parseFloat(firstValue) || 0;
    const second = parseFloat(secondValue) || 0;

    if (first < MIN_VALUE || first > MAX_VALUE) {
      throw new Error(
        `First value must be between ${MIN_VALUE} and ${MAX_VALUE}`
      );
    }

    if (operator && second !== 0) {
      if (relativeDeviation) {
        if (second < 0.5 || second > 100) {
          throw new Error("Relative deviation must be between 0.5% and 100%");
        }
      } else {
        if (second < MIN_VALUE || second > MAX_VALUE) {
          throw new Error(
            `Second value must be between ${MIN_VALUE} and ${MAX_VALUE}`
          );
        }
      }
    }

    if (operator === "-" && first >= second) {
      throw new Error("First limit must be less than Second");
    }

    if (operator === "±") {
      if (relativeDeviation && second > 100) {
        throw new Error("Relative deviation cannot exceed 100%");
      }
      if (!relativeDeviation && second >= first) {
        throw new Error("Absolute deviation must be less than Setpoint");
      }
    }
  };

  const formatOutputString = () => {
    const first = parseFloat(firstValue) || 0;
    const second = parseFloat(secondValue) || 0;

    if (!operator || second === 0) return first.toString();
    if (operator === "-") return `${first} - ${second}`;
    if (operator === "±")
      return relativeDeviation
        ? `${first} ± ${second}%`
        : `${first} ± ${second}`;
    return first.toString();
  };

  const handleSave = () => {
    try {
      validateValues();
      const first = parseFloat(firstValue) || 0;
      const second = parseFloat(secondValue) || 0;

      const result = {
        firstValue: first,
        secondValue: second,
        mode: displayMode,
      };

      console.log("Output string: " + formatOutputString());
      onSave(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOperator = e.target.value;
    setOperator(newOperator);
    if (newOperator === "") {
      setSecondValue("");
      setRelativeDeviation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "24px" }}>{title}</h2>
        <InputGroup>
          <InputWrapper>
            <Input
              type="number"
              value={firstValue}
              onChange={(e) => setFirstValue(e.target.value)}
              placeholder="Enter first value"
              min={MIN_VALUE}
              max={MAX_VALUE}
              step="0.1"
            />
          </InputWrapper>
          <InputWrapper>
            <Select
              value={operator}
              onChange={handleOperatorChange}
              disabled={!firstValue}
            >
              <option value="">Single Value</option>
              <option value="-">-</option>
              <option value="±">±</option>
            </Select>
          </InputWrapper>
          <InputWrapper>
            <Input
              type="number"
              value={secondValue}
              onChange={(e) => setSecondValue(e.target.value)}
              placeholder="Enter second value"
              min={MIN_VALUE}
              max={MAX_VALUE}
              step="0.1"
              disabled={!operator}
            />
          </InputWrapper>
          <CheckboxWrapper $disabled={!operator || operator !== "±"}>
            <Checkbox
              type="checkbox"
              checked={relativeDeviation}
              onChange={(e) => setRelativeDeviation(e.target.checked)}
              disabled={!operator || operator !== "±"}
              $disabled={!operator || operator !== "±"}
            />
            <CheckboxLabel $disabled={!operator || operator !== "±"}>
              %
            </CheckboxLabel>
          </CheckboxWrapper>
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonGroup>
          <Button $primary onClick={handleSave}>
            Apply
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
