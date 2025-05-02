import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { StyledInput } from "./common/StyledInput";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledRow = styled.tr``;

const StyledCell = styled.td<{
  center?: boolean;
  right?: boolean;
  height?: string;
  width?: string;
}>`
  padding: 4px;
  text-align: ${(props) =>
    props.center ? "center" : props.right ? "right" : "left"};
  height: ${(props) => props.height || "auto"};
  width: ${(props) => props.width || "auto"};
  padding-right: ${(props) => (props.right ? "8px" : "4px")};
`;

const TitleCell = styled(StyledCell)`
  font-size: 14px;
`;

export function Header() {
  const { wpsData, updateHeader } = useWPS();

  return (
    <StyledTable border={1}>
      <tbody>
        <StyledRow>
          <StyledCell width="33.33%" />
          <TitleCell center width="33.33%">
            Welding Procedure Specification
          </TitleCell>
          <StyledCell width="33.33%">
            <div style={{ display: "flex", gap: "8px" }}>
              <div>
                <div style={{ marginBottom: "4px" }}>
                  <span>WPS-Nr:</span>
                </div>
                <StyledInput
                  value={wpsData.header.wpsNr}
                  onChange={(value) => updateHeader("wpsNr", value)}
                />
              </div>
              <div>
                <div style={{ marginBottom: "4px" }}>
                  <span>Revision:</span>
                </div>
                <StyledInput
                  value={wpsData.header.revision}
                  onChange={(value) => updateHeader("revision", value)}
                />
              </div>
            </div>
          </StyledCell>
        </StyledRow>
        <StyledRow>
          <StyledCell width="33.33%" />
          <StyledCell center width="33.33%">
            Sample WPS
          </StyledCell>
          <StyledCell right width="33.33%">
            Page 1 of 2
          </StyledCell>
        </StyledRow>
      </tbody>
    </StyledTable>
  );
}
