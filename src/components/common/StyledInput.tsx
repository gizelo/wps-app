import styled from "styled-components";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  width?: string;
  centered?: boolean;
}

interface StyledContainerProps {
  $width?: string;
}

const StyledInputContainer = styled.div<StyledContainerProps>`
  display: inline-block;
  width: ${(props) => props.$width || "100%"};
`;

const Input = styled.input<Omit<InputProps, "onChange">>`
  width: 100%;
  padding: 4px 8px;
  border: none;
  background: #f2f2f2;
  font-size: 10px;
  text-align: ${(props) => (props.centered ? "center" : "left")};

  &:hover {
    outline: 1px solid #007bff;
  }

  &:focus {
    outline: 1px solid #007bff;
    background: #f8f9fa;
    color: black;
  }

  &::placeholder {
    color: #666;
  }
`;

export function StyledInput({
  value,
  onChange,
  placeholder,
  type = "text",
  width,
  centered,
}: InputProps) {
  return (
    <StyledInputContainer $width={width}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        centered={centered}
      />
    </StyledInputContainer>
  );
}
