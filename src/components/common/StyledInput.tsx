import styled from "styled-components";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  width?: string;
}

interface StyledContainerProps {
  $width?: string;
}

const StyledInputContainer = styled.div<StyledContainerProps>`
  display: inline-block;
  width: ${(props) => props.$width || "100%"};
`;

const Input = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: none;
  background: #f2f2f2;
  font-size: 10px;

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
}: InputProps) {
  return (
    <StyledInputContainer $width={width}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </StyledInputContainer>
  );
}
