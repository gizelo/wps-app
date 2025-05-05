import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
`;

const OptionItem = styled.div<{ selected?: boolean; isParent?: boolean }>`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  background: ${(props) => (props.selected ? "#e3f2fd" : "transparent")};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${(props) => (props.selected ? "#e3f2fd" : "#f5f5f5")};
  }
`;

const NestedOptions = styled.div`
  margin-left: 24px;
  border-left: 2px solid #eee;
  padding-left: 8px;
`;

const ExpandIcon = styled.span<{ expanded: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  transform: rotate(${(props) => (props.expanded ? "90deg" : "0deg")});
  transition: transform 0.2s;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Button = styled.button<{ primary?: boolean; disabled?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.primary ? "transparent" : "#ccc")};
  background: ${(props) => {
    if (props.disabled) return "#e9ecef";
    return props.primary ? "#007bff" : "white";
  }};
  color: ${(props) => {
    if (props.disabled) return "#6c757d";
    return props.primary ? "white" : "inherit";
  }};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background: ${(props) => {
      if (props.disabled) return "#e9ecef";
      return props.primary ? "#0056b3" : "#f5f5f5";
    }};
  }
`;

export interface SelectionOption {
  id: string;
  label: string;
  description?: string;
  children?: SelectionOption[];
}

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: SelectionOption[];
  selectedId?: string;
  onSelect: (option: SelectionOption) => void;
  searchable?: boolean;
}

export function SelectionModal({
  isOpen,
  onClose,
  title,
  options,
  selectedId,
  onSelect,
  searchable = true,
}: SelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [tempSelected, setTempSelected] = useState<SelectionOption | null>(
    null
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Find the selected option and its parent in the nested structure
      const findSelectedAndParent = (
        opts: SelectionOption[],
        parentId: string | null = null
      ): { selected: SelectionOption | null; parentId: string | null } => {
        for (const opt of opts) {
          if (opt.id === selectedId) {
            return { selected: opt, parentId };
          }
          if (opt.children) {
            const found = findSelectedAndParent(opt.children, opt.id);
            if (found.selected) return found;
          }
        }
        return { selected: null, parentId: null };
      };

      const { selected, parentId } = findSelectedAndParent(options);
      setTempSelected(selected);

      // Expand the parent item if it exists
      if (parentId) {
        setExpandedItems(new Set([parentId]));
      }
    }
  }, [isOpen, selectedId, options]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Check if selection has changed
  const hasSelectionChanged = useMemo(() => {
    if (!tempSelected) return false;
    return tempSelected.id !== selectedId;
  }, [tempSelected, selectedId]);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApply = () => {
    if (tempSelected) {
      onSelect(tempSelected);
    }
    onClose();
  };

  const renderOptions = (options: SelectionOption[], level = 0) => {
    return options
      .filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          option.children?.some(
            (child) =>
              child.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              child.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
      )
      .map((option) => (
        <Fragment key={option.id}>
          <OptionItem
            selected={tempSelected?.id === option.id}
            isParent={!!option.children?.length}
            onClick={() => {
              if (option.children?.length) {
                toggleExpand(option.id);
              } else {
                setTempSelected(option);
              }
            }}
          >
            {option.children?.length && (
              <ExpandIcon expanded={expandedItems.has(option.id)}>▶</ExpandIcon>
            )}
            <div>
              <div style={{ fontSize: "1.2em", fontWeight: 500 }}>
                {option.label}
              </div>
              {option.description && (
                <div style={{ fontSize: "1.2em", color: "#666" }}>
                  {option.description}
                </div>
              )}
            </div>
          </OptionItem>
          {option.children && expandedItems.has(option.id) && (
            <NestedOptions>
              {renderOptions(option.children, level + 1)}
            </NestedOptions>
          )}
        </Fragment>
      ));
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h1>{title}</h1>
        </ModalHeader>

        {searchable && (
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        <OptionList>{renderOptions(options)}</OptionList>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary disabled={!hasSelectionChanged} onClick={handleApply}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}
