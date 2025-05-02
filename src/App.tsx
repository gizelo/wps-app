import styled from "styled-components";
import { WPSProvider } from "./context/WPSContext";
import { Header } from "./components/Header";
import { GeneralInfo } from "./components/GeneralInfo";
import { JointDesign } from "./components/JointDesign";
import { WeldingDetails } from "./components/tables/WeldingDetails";
import { FillerMetal } from "./components/tables/FillerMetal";
import { ShieldingGas } from "./components/tables/ShieldingGas";
import { FurtherInfo } from "./components/tables/FurtherInfo";
import { SaveButton } from "./components/SaveButton";
import { SignaturesTable } from "./components/SignaturesTable";

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  width: 210mm; /* A4 width */
  // height: 297mm; /* A4 height */
  padding: 8mm;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-top: 16px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: normal;
`;

function App() {
  return (
    <WPSProvider>
      <PageWrapper>
        <SaveButton />
        <Container>
          <Header />
          <GeneralInfo />
          <JointDesign />
          <Section>
            <SectionTitle>Details for welding</SectionTitle>
            <WeldingDetails />
          </Section>
          <Section>
            <SectionTitle>Filler metal</SectionTitle>
            <FillerMetal />
          </Section>
          <Section>
            <SectionTitle>Shielding gas</SectionTitle>
            <ShieldingGas />
          </Section>
          <Section>
            <SectionTitle>Further information</SectionTitle>
            <FurtherInfo />
          </Section>
          <Section>
            <SignaturesTable />
          </Section>
        </Container>
      </PageWrapper>
    </WPSProvider>
  );
}

export default App;
