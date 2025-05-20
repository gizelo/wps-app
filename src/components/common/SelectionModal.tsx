import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import styled from "styled-components";
import React from "react";
import { FillerMetalDatasheetModal } from "./FillerMetalDatasheetModal";

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
  width: 80%;
  height: 80vh;
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

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #b1b1b1;
  border-radius: 4px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  overflow-y: auto;
  padding-right: 14px;
  flex: 1;
`;

const DescriptionPanel = styled.div`
  width: 100%;
  background-color: #f8f8f8;
  padding: 12px;
  border-top: 1px solid #b1b1b1;
  border-left: 1px solid #b1b1b1;
  border-top-left-radius: 4px;
  font-size: 1.2em;
  text-wrap: auto;
  text-align: left;
`;

const CategoryItem = styled.div<{ selected?: boolean; isParent?: boolean }>`
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  background: ${(props) => (props.selected ? "#e3f2fd" : "transparent")};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${(props) => (props.selected ? "#e3f2fd" : "#f5f5f5")};
  }
`;

const NestedCategories = styled.div`
  margin-left: 24px;
  border-left: 2px solid #dedede;
  padding-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExpandIcon = styled.span<{ expanded: boolean }>`
  display: inline-block;
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
  padding-top: 14px;
  border-top: 1px solid #b1b1b1;
`;

const Button = styled.button<{ primary?: boolean; disabled?: boolean }>`
  font-weight: 600;
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

const TableContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  padding-left: 14px;
  border-left: 1px solid #b1b1b1;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.2em;
  border: 1px solid #b1b1b1;
`;

const Th = styled.th<{ centred?: boolean }>`
  padding: 8px 12px;
  text-align: ${(props) => (props.centred ? "center" : "left")};
  border-bottom: 1px solid #b1b1b1;
  background: #f8f9fa;
  position: sticky;
  top: 0;
  border: 1px solid #b1b1b1;
`;

const Td = styled.td<{ centred?: boolean }>`
  padding: 8px 12px;
  border-bottom: 1px solid #b1b1b1;
  text-align: ${(props) => (props.centred ? "center" : "left")};
  border: 1px solid #b1b1b1;
`;

const Tr = styled.tr<{ selected?: boolean }>`
  cursor: pointer;
  background: ${(props) => (props.selected ? "#e3f2fd" : "transparent")};

  &:hover {
    background: ${(props) => (props.selected ? "#e3f2fd" : "#f5f5f5")};
  }
`;

const ChemicalCompositionPanel = styled.div`
  width: 100%;
  background-color: #f8f8f8;
  padding: 12px;
  border: 1px solid #b1b1b1;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  font-size: 1.2em;
  text-wrap: auto;
  text-align: left;
  margin-top: 10px;
`;

export interface Category {
  id: string;
  label: string;
  description?: string;
  children?: Category[];
}

export interface Item {
  id: string;
  categoryId: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  title: string;
  categories: Category[];
  items: Item[];
  selectedId?: string;
  onSelect: (item: Item) => void;
  searchable?: boolean;
  tableColumns: { key: string; label: string; centred?: boolean }[];
  layerIndex?: number;
  isFillerSelection?: boolean;
  showChemicalComposition?: boolean;
}

interface TableProps {
  items: Item[];
  selectedCategory: Category | null;
  tempSelected: Item | null;
  onSelect: (item: Item) => void;
  tableColumns: { key: string; label: string; centred?: boolean }[];
  showChemicalComposition?: boolean;
}

const MemoizedTable = React.memo(function TableComponent({
  items,
  selectedCategory,
  tempSelected,
  onSelect,
  tableColumns,
  showChemicalComposition,
}: TableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Save scroll position before re-render
  useEffect(() => {
    if (tableRef.current) {
      setScrollPosition(tableRef.current.scrollTop);
    }
  }, [tempSelected]);

  // Restore scroll position after re-render
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.categoryId === selectedCategory?.id);
  }, [items, selectedCategory?.id]);

  const formatChemicalComposition = (composition: unknown) => {
    if (Array.isArray(composition)) {
      return composition.filter(Boolean).join(", ");
    }
    return "";
  };

  return (
    <TableContainer ref={tableRef}>
      <Table>
        <thead>
          <tr>
            {tableColumns.map((col) => (
              <Th key={col.key} centred={col.centred}>
                {col.label}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <Tr
              key={item.id}
              selected={tempSelected?.id === item.id}
              onClick={() => onSelect(item)}
            >
              {tableColumns.map((col) => (
                <Td key={col.key} centred={col.centred}>
                  {item[col.key] || ""}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
      {showChemicalComposition && tempSelected?.ChemicalComposition && (
        <ChemicalCompositionPanel>
          {formatChemicalComposition(tempSelected.ChemicalComposition)}
        </ChemicalCompositionPanel>
      )}
    </TableContainer>
  );
});

export function SelectionModal({
  isOpen,
  onClose,
  onReset,
  title,
  categories,
  items,
  selectedId,
  onSelect,
  searchable = true,
  tableColumns,
  layerIndex,
  isFillerSelection = false,
  showChemicalComposition = false,
}: SelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [tempSelected, setTempSelected] = useState<Item | null>(null);
  const [isDatasheetOpen, setIsDatasheetOpen] = useState(false);

  const handleTableItemSelect = useCallback((item: Item) => {
    setTempSelected(item);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setExpandedItems(new Set());
      setSelectedCategory(null);
      setTempSelected(null);
      setIsDatasheetOpen(false);
    }
  }, [isOpen]);

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
    if (isOpen && selectedId) {
      const selectedItem = items.find((item) => item.id === selectedId);
      if (selectedItem) {
        setTempSelected(selectedItem);
        // Find and set the parent category
        const findCategory = (cats: Category[]): Category | null => {
          for (const cat of cats) {
            if (cat.id === selectedItem.categoryId) return cat;
            if (cat.children) {
              const found = findCategory(cat.children);
              if (found) return found;
            }
          }
          return null;
        };
        const category = findCategory(categories);
        if (category) {
          setSelectedCategory(category);
          // Find parent category if this is a subgroup
          const findParentCategory = (cats: Category[]): Category | null => {
            for (const cat of cats) {
              if (cat.children?.some((child) => child.id === category.id)) {
                return cat;
              }
              if (cat.children) {
                const found = findParentCategory(cat.children);
                if (found) return found;
              }
            }
            return null;
          };
          const parentCategory = findParentCategory(categories);
          setExpandedItems(
            new Set([
              category.id,
              ...(parentCategory ? [parentCategory.id] : []),
            ])
          );
        }
      }
    }
  }, [isOpen, selectedId, items, categories]);

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

  const handleDatasheetOpen = () => {
    if (tempSelected) {
      setIsDatasheetOpen(true);
    }
  };

  const handleDatasheetApply = () => {
    setIsDatasheetOpen(false);
    onClose();
  };

  const renderCategories = (categories: Category[], level = 0) => {
    return categories
      .filter(
        (category) =>
          category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.children?.some(
            (child) =>
              child.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
              child.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
      )
      .map((category) => (
        <Fragment key={category.id}>
          <CategoryItem
            selected={selectedCategory?.id === category.id}
            isParent={!!category.children?.length}
            onClick={() => {
              if (category.children?.length) {
                toggleExpand(category.id);
              }
              setSelectedCategory(category);
              setTempSelected(null);
            }}
          >
            {category.children && (
              <ExpandIcon expanded={expandedItems.has(category.id)}>
                ▶
              </ExpandIcon>
            )}
            <span style={{ fontSize: "1.2em" }}>{category.label}</span>
          </CategoryItem>
          {category.children && expandedItems.has(category.id) && (
            <NestedCategories>
              {renderCategories(category.children, level + 1)}
            </NestedCategories>
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
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategory(null);
              }}
            />
            {isFillerSelection && (
              <Button
                onClick={handleDatasheetOpen}
                disabled={!tempSelected}
                style={{
                  color: tempSelected ? "white" : "#6c757d",
                  background: tempSelected ? "#ff9600" : "#e9ecef",
                  borderColor: tempSelected ? "#ff9600" : "#ccc",
                }}
              >
                Datasheet
              </Button>
            )}
          </SearchContainer>
        )}

        <ContentContainer>
          <LeftPanel>
            <CategoryList>{renderCategories(categories)}</CategoryList>
            {selectedCategory?.description && (
              <DescriptionPanel>
                {selectedCategory?.description}
              </DescriptionPanel>
            )}
          </LeftPanel>
          <MemoizedTable
            items={items}
            selectedCategory={selectedCategory}
            tempSelected={tempSelected}
            onSelect={handleTableItemSelect}
            tableColumns={tableColumns}
            showChemicalComposition={showChemicalComposition}
          />
        </ContentContainer>

        <ModalFooter>
          <Button primary disabled={!hasSelectionChanged} onClick={handleApply}>
            Apply
          </Button>
          <Button onClick={onReset}>Reset</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>

        {tempSelected && layerIndex !== undefined && (
          <FillerMetalDatasheetModal
            isOpen={isDatasheetOpen}
            onClose={() => setIsDatasheetOpen(false)}
            onApply={handleDatasheetApply}
            brandname={String(tempSelected.Brandname || "")}
            manufacturer={String(tempSelected.Manufacturer || "")}
            layerIndex={layerIndex}
          />
        )}
      </ModalContent>
    </ModalOverlay>
  );
}
