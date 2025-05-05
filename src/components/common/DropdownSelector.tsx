import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SelectorWrapper = styled.div`
  position: relative;
`;

const SelectorButton = styled.div<{
  hasValue: boolean;
}>`
  cursor: pointer;
  padding: 4px;
  background: #f2f2f2;

  &:hover {
    outline: 1px solid #007bff;
  }

  color: ${({ hasValue }) => (hasValue ? "inherit" : "#888")};
`;

const DropdownMenu = styled.div`
  position: absolute;
  z-index: 10;
  background: #fff;
  border: 1px solid #ccc;
  min-width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ProcessItem = styled.div<{ hovered: boolean }>`
  padding: 6px;
  background: ${({ hovered }) => (hovered ? "#f0f0f0" : "#fff")};
  border-bottom: 1px solid #eee;
  position: relative;
`;

const SubprocessMenu = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  background: #fff;
  border: 1px solid #ccc;
  min-width: 260px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const SubprocessItem = styled.div`
  padding: 6px;
  cursor: pointer;
  white-space: nowrap;
`;

export interface Option {
  id: string;
  label: string;
  description?: string;
  subOptions?: Option[];
}

interface DropdownSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export function DropdownSelector({
  value,
  onChange,
  options,
  placeholder = "Select option",
}: DropdownSelectorProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const selected = options
    .flatMap((opt) => opt.subOptions || [])
    .find((opt) => opt.id === value);

  return (
    <SelectorWrapper ref={ref}>
      <SelectorButton hasValue={!!selected} onClick={() => setOpen((o) => !o)}>
        {selected ? selected.label : <span>{placeholder}</span>}
      </SelectorButton>
      {open && (
        <DropdownMenu>
          {options.map((option) => (
            <ProcessItem
              key={option.id}
              hovered={hovered === option.id}
              onMouseEnter={() => setHovered(option.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ fontWeight: 500 }}>{option.label}</span>
              {option.description && ` - ${option.description}`}
              {hovered === option.id && option.subOptions && (
                <SubprocessMenu>
                  {option.subOptions.map((sub) => (
                    <SubprocessItem
                      key={sub.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(sub.id);
                        setOpen(false);
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{sub.label}</span>
                      {sub.description && ` - ${sub.description}`}
                    </SubprocessItem>
                  ))}
                </SubprocessMenu>
              )}
            </ProcessItem>
          ))}
        </DropdownMenu>
      )}
    </SelectorWrapper>
  );
}
