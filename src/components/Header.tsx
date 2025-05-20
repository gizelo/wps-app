import styled from "styled-components";
import { useWPS } from "../context/WPSContext";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
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
  border: 1px solid #ccc;
`;

const TitleCell = styled(StyledCell)`
  font-size: 1.4em;
  font-weight: bold;
`;

export function Header() {
  const { wpsData, updateWPSData } = useWPS();

  const handleWPSNumberChange = (value: string) => {
    updateWPSData({ WPSNumber: value });
  };

  const handleRevisionChange = (value: string) => {
    updateWPSData({ Revision: value });
  };

  const handleDesignationChange = (value: string) => {
    updateWPSData({ Designation: value });
  };

  return (
    <StyledTable>
      <tbody>
        <StyledRow>
          <StyledCell width="30%" rowSpan={2}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "8px",
              }}
            >
              <img
                src="/company.png"
                alt="Company Logo"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </StyledCell>
          <TitleCell center width="50%">
            {wpsData.Caption}
          </TitleCell>
          <StyledCell center width="5%">
            <div style={{ marginBottom: "4px" }}>
              <span>WPS-Nr:</span>
            </div>
            <input
              type="text"
              value={wpsData.WPSNumber}
              onChange={(e) => handleWPSNumberChange(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1em",
              }}
            />
          </StyledCell>
          <StyledCell center width="5%">
            <div style={{ marginBottom: "4px" }}>
              <span>Revision:</span>
            </div>
            <input
              type="text"
              value={wpsData.Revision}
              onChange={(e) => handleRevisionChange(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1em",
              }}
            />
          </StyledCell>
          <StyledCell rowSpan={2} width="20%">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "4px",
              }}
            >
              <img
                src="/qr.jpeg"
                alt="QR Code"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </StyledCell>
        </StyledRow>
        <StyledRow>
          <StyledCell center width="50%">
            <input
              type="text"
              value={wpsData.Designation}
              onChange={(e) => handleDesignationChange(e.target.value)}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                textAlign: "center",
                fontSize: "1em",
              }}
            />
          </StyledCell>
          <StyledCell center colSpan={2} width="10%">
            Page 1 of 2
          </StyledCell>
        </StyledRow>
      </tbody>
    </StyledTable>
  );
}
