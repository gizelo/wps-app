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

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  width: 210mm; /* A4 width */
  padding: 20mm;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin: 16px 0;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
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
        </Container>
      </PageWrapper>
    </WPSProvider>
  );
}

export default App;
