import styled from "styled-components";
import img1 from "../assets/images/img1.jpeg";
import img2 from "../assets/images/img2.jpeg";
import { useWPS } from "../context/WPSContext";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
`;

const Section = styled.div``;

const Title = styled.div`
  margin-bottom: 4px;
  font-weight: bold;
`;

const ImageContainer = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border: 1px solid #000;
  padding: 8px;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export function JointDesign() {
  const { wpsData } = useWPS();

  return (
    <Container>
      <Section>
        <Title>Joint design</Title>
        <ImageContainer>
          {wpsData.JointDesignImage ? (
            <StyledImage
              src={wpsData.JointDesignImage}
              alt="Joint design diagram"
            />
          ) : (
            <StyledImage src={img1} alt="Joint design diagram" />
          )}
        </ImageContainer>
      </Section>
      <Section>
        <Title>Weld buildup</Title>
        <ImageContainer>
          {wpsData.WeldBuildupImage ? (
            <StyledImage
              src={wpsData.WeldBuildupImage}
              alt="Weld buildup diagram"
            />
          ) : (
            <StyledImage src={img2} alt="Weld buildup diagram" />
          )}
        </ImageContainer>
      </Section>
    </Container>
  );
}
