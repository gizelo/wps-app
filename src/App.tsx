import styled from "styled-components";
import { WPSProvider } from "./context/WPSContext";
import { Header } from "./components/Header";
import { GeneralInfo } from "./components/GeneralInfo";
import { JointDesign } from "./components/JointDesign";
import { WeldingDetails } from "./components/tables/WeldingDetails";
import { FillerMetal } from "./components/tables/FillerMetal";
import { ShieldingGas } from "./components/tables/ShieldingGas";
import { FurtherInfo } from "./components/tables/FurtherInfo";
import { SignaturesTable } from "./components/SignaturesTable";
import { Box, Button, Paper } from "@mui/material";
import { useWPS } from "./context/WPSContext";
import { useState } from "react";
import { LayersModal } from "./components/LayersModal";
import { AppHeader } from "./components/AppHeader";

const Container = styled.div`
  width: 210mm; /* A4 width */
  padding: 8mm;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 10px; /* A4 specific font size */
`;

const Section = styled.div`
  margin-top: 16px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 4px;
  font-size: 10px;
`;

function AppContent() {
  const { wpsData, saveWPSData } = useWPS();
  const [isLayersModalOpen, setIsLayersModalOpen] = useState(false);

  return (
    <>
      <AppHeader />
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            display: "flex",
            gap: 1,
            padding: 1,
            borderRadius: 2,
          }}
        >
          <Button variant="contained" onClick={saveWPSData}>
            Save JSON
          </Button>
          <Button variant="outlined" onClick={() => setIsLayersModalOpen(true)}>
            Layers ({wpsData.Layers?.length || 0})
          </Button>
        </Paper>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
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
        </Box>
        <LayersModal
          isOpen={isLayersModalOpen}
          onClose={() => setIsLayersModalOpen(false)}
        />
      </Box>
    </>
  );
}

function App() {
  return (
    <WPSProvider>
      <AppContent />
    </WPSProvider>
  );
}

export default App;
