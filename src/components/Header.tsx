import styled from "styled-components";
import { useWPS } from "../context/WPSContext";
import { StyledInput } from "./common/StyledInput";

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  border: 1px solid #000;
  margin-bottom: 16px;
`;

const HeaderSection = styled.div`
  padding: 8px;
  border-right: 1px solid #000;

  &:last-child {
    border-right: none;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
`;

const SubTitle = styled.div`
  text-align: center;
  font-size: 14px;
  margin-top: 4px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px;
  align-items: center;
  margin-top: 4px;
`;

const Label = styled.span`
  font-size: 14px;
`;

export function Header() {
  const { wpsData, updateHeader } = useWPS();

  return (
    <HeaderContainer>
      <HeaderSection />
      <HeaderSection>
        <Title>Welding Procedure Specification</Title>
        <SubTitle>Sample WPS</SubTitle>
      </HeaderSection>
      <HeaderSection>
        <InfoGrid>
          <Label>WPS-Nr:</Label>
          <StyledInput
            value={wpsData.header.wpsNr}
            onChange={(value) => updateHeader("wpsNr", value)}
          />
          <Label>Revision:</Label>
          <StyledInput
            value={wpsData.header.revision}
            onChange={(value) => updateHeader("revision", value)}
          />
          <Label>Page:</Label>
          <span>1 of 2</span>
        </InfoGrid>
      </HeaderSection>
    </HeaderContainer>
  );
}
