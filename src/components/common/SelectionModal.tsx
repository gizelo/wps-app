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
  width: 90%;
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

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
  overflow: hidden;
  width: 100%;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 300px;
  overflow-y: auto;
  padding-right: 14px;
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

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.2em;
`;

const Th = styled.th`
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  background: #f8f9fa;
  position: sticky;
  top: 0;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const Tr = styled.tr<{ selected?: boolean }>`
  cursor: pointer;
  background: ${(props) => (props.selected ? "#e3f2fd" : "transparent")};

  &:hover {
    background: ${(props) => (props.selected ? "#e3f2fd" : "#f5f5f5")};
  }
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
  [key: string]: string | number | boolean | undefined;
}

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  categories: Category[];
  items: Item[];
  selectedId?: string;
  onSelect: (item: Item) => void;
  searchable?: boolean;
  tableColumns: { key: string; label: string }[];
}

export function SelectionModal({
  isOpen,
  onClose,
  title,
  categories,
  items,
  selectedId,
  onSelect,
  searchable = true,
  tableColumns,
}: SelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [tempSelected, setTempSelected] = useState<Item | null>(null);

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
    if (!isOpen) {
      // Reset selection when modal closes
      setTempSelected(null);
      setSelectedCategory(null);
      setExpandedItems(new Set());
    }
  }, [isOpen]);

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
            <div>
              <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                {category.label}
              </span>
              {category.description && (
                <span
                  style={{
                    fontSize: "1.2em",
                    color: "#454545",
                    marginLeft: "10px",
                  }}
                >
                  {category.description}
                </span>
              )}
            </div>
          </CategoryItem>
          {category.children && expandedItems.has(category.id) && (
            <NestedCategories>
              {renderCategories(category.children, level + 1)}
            </NestedCategories>
          )}
        </Fragment>
      ));
  };

  const renderTable = () => {
    if (!selectedCategory) return null;

    const filteredItems = items.filter(
      (item) => item.categoryId === selectedCategory.id
    );

    return (
      <TableContainer>
        <Table>
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <Th key={col.key}>{col.label}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <Tr
                key={item.id}
                selected={tempSelected?.id === item.id}
                onClick={() => setTempSelected(item)}
              >
                {tableColumns.map((col) => (
                  <Td key={col.key}>{item[col.key] || ""}</Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
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

        <ContentContainer>
          <CategoryList>{renderCategories(categories)}</CategoryList>
          {renderTable()}
        </ContentContainer>

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
