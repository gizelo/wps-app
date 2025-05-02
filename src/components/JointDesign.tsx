import styled from "styled-components";
import img1 from "../assets/images/img1.jpeg";
import img2 from "../assets/images/img2.jpeg";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
`;

const Section = styled.div``;

const Title = styled.div`
  margin-bottom: 8px;
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
  return (
    <Container>
      <Section>
        <Title>Joint design</Title>
        <ImageContainer>
          <StyledImage src={img1} alt="Joint design diagram" />
        </ImageContainer>
      </Section>
      <Section>
        <Title>Weld buildup</Title>
        <ImageContainer>
          <StyledImage src={img2} alt="Weld buildup diagram" />
        </ImageContainer>
      </Section>
    </Container>
  );
}
