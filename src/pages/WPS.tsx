import styled from "styled-components";
import { Box } from "@mui/material";
import { useState } from "react";
import { Header } from "../components/Header";
import { GeneralInfo } from "../components/GeneralInfo";
import { JointDesign } from "../components/JointDesign";
import { WeldingDetails } from "../components/tables/WeldingDetails";
import { FillerMetal } from "../components/tables/FillerMetal";
import { ShieldingGas } from "../components/tables/ShieldingGas";
import { FurtherInfo } from "../components/tables/FurtherInfo";
import { SignaturesTable } from "../components/SignaturesTable";
import { LayersModal } from "../components/LayersModal";
import { ActionButtons } from "../components/ActionButtons";
import { useWPS } from "../context/WPSContext";

const Container = styled.div`
  width: 210mm; /* A4 width */
  padding: 8mm;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 10px; /* A4 specific font size */
  color: black;
`;

const Section = styled.div`
  margin-top: 16px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 4px;
  font-size: 10px;
`;

export function WPSPage() {
  const { wpsData, saveWPSData } = useWPS();
  const [isLayersModalOpen, setIsLayersModalOpen] = useState(false);

  return (
    <Box sx={{ pb: 2 }}>
      <ActionButtons
        buttons={[
          { label: "New", disabled: true },
          { label: "Load", disabled: true },
          {
            label: `Layers (${wpsData.Layers?.length || 0})`,
            onClick: () => setIsLayersModalOpen(true),
          },
          { label: "Qualify", disabled: true },
          {
            label: "Import",
            disabled: true,
          },
          {
            label: "Export",
            onClick: saveWPSData,
          },
        ]}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
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
  );
}
