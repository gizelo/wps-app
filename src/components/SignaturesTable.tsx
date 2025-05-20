import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { StyledSelect } from "./common/StyledSelect";
import { users } from "../constants/users";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Td = styled.td`
  padding: 4px;
`;

const CellContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
`;

const CellLabel = styled.span`
  width: 100%;
`;

const DateInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 1em;
`;

export function SignaturesTable() {
  const { wpsData, updateWPSData } = useWPS();

  // Helper to convert MM/DD/YYYY or DD/MM/YYYY to YYYY-MM-DD for input type=date
  const toISODate = (str: string) => {
    if (!str) return "";
    if (/\d{4}-\d{2}-\d{2}/.test(str)) return str; // already ISO
    const parts = str.split("/");
    if (parts.length === 3) {
      // Try MM/DD/YYYY
      if (parts[2].length === 4)
        return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(
          2,
          "0"
        )}`;
    }
    return str;
  };

  const userOptions = users.map((user) => ({
    value: user.Name,
    label: user.Name,
  }));

  return (
    <Table border={1}>
      <tbody>
        <tr>
          <Td>
            <CellContainer>
              <CellLabel>Date created:</CellLabel>
              <DateInput
                type="date"
                value={toISODate(wpsData.CreationDate)}
                onChange={(e) =>
                  updateWPSData({ CreationDate: e.target.value })
                }
              />
            </CellContainer>
          </Td>
          <Td>
            <CellContainer>
              <CellLabel>Date approved:</CellLabel>
              <DateInput
                type="date"
                value={toISODate(wpsData.ApprovalDate)}
                onChange={(e) =>
                  updateWPSData({ ApprovalDate: e.target.value })
                }
              />
            </CellContainer>
          </Td>
          <Td>
            <CellContainer>
              <CellLabel>Date released:</CellLabel>
              <DateInput
                type="date"
                value={toISODate(wpsData.ReleaseDate)}
                onChange={(e) => updateWPSData({ ReleaseDate: e.target.value })}
              />
            </CellContainer>
          </Td>
        </tr>
        <tr>
          <Td>
            <CellContainer>
              <CellLabel>Signature:</CellLabel>
              <div>
                <StyledSelect
                  value={wpsData.CreatedBy || ""}
                  onChange={(value) =>
                    updateWPSData({ CreatedBy: value as string })
                  }
                  options={userOptions}
                />
              </div>
            </CellContainer>
          </Td>
          <Td>
            <CellContainer>
              <CellLabel>Signature:</CellLabel>
              <div>
                <StyledSelect
                  value={wpsData.ApprovedBy || ""}
                  onChange={(value) =>
                    updateWPSData({ ApprovedBy: value as string })
                  }
                  options={userOptions}
                />
              </div>
            </CellContainer>
          </Td>
          <Td>
            <CellContainer>
              <CellLabel>Signature:</CellLabel>
              <div>
                <StyledSelect
                  value={wpsData.ReleasedBy || ""}
                  onChange={(value) =>
                    updateWPSData({ ReleasedBy: value as string })
                  }
                  options={userOptions}
                />
              </div>
            </CellContainer>
          </Td>
        </tr>
      </tbody>
    </Table>
  );
}
