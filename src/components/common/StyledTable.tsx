import styled from "styled-components";
import { StyledInput } from "./StyledInput";

interface TableProps {
  headers: string[];
  data: Record<string, string>[];
  onUpdate: (index: number, field: string, value: string) => void;
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
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #000;
  padding: 4px;
`;

export function StyledTable({ headers, data, onUpdate }: TableProps) {
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
                  <StyledInput
                    value={row[header] || ""}
                    onChange={(value) => onUpdate(rowIndex, header, value)}
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}
