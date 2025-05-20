import styled from "styled-components";
import { StyledInput } from "./StyledInput";
import React from "react";

interface TableProps {
  headers: string[];
  data: Record<string, string>[];
  onUpdate: (index: number, field: string, value: string) => void;
  customRenderers?: {
    [column: string]: (value: string, rowIndex: number) => React.ReactNode;
  };
  readOnlyColumns?: string[];
}

const TableContainer = styled.div`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #000;
  padding: 6px;
  font-weight: normal;
  vertical-align: top;
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #000;
  text-align: center;
  white-space: nowrap;
`;

export function StyledTable({
  headers,
  data,
  onUpdate,
  customRenderers,
  readOnlyColumns = [],
}: TableProps) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <Td key={colIndex}>
                  {customRenderers && customRenderers[header] ? (
                    customRenderers[header](row[header], rowIndex)
                  ) : readOnlyColumns.includes(header) ? (
                    row[header] || ""
                  ) : (
                    <StyledInput
                      value={row[header] || ""}
                      onChange={(value) => onUpdate(rowIndex, header, value)}
                      centered
                    />
                  )}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}
