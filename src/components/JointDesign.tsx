import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
`;

const Section = styled.div`
  border: 1px solid #000;
  padding: 16px;
`;

const Title = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const DiagramContainer = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  position: relative;
`;

const JointDiagram = styled.div`
  width: 300px;
  height: 100px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 2px;
    background: #000;
  }

  &::after {
    content: "30°";
    position: absolute;
    top: 30%;
    left: 45%;
    font-size: 12px;
  }

  .angle-right {
    content: "30°";
    position: absolute;
    top: 30%;
    right: 45%;
    font-size: 12px;
  }

  .left-line,
  .right-line {
    position: absolute;
    top: 50%;
    width: 60px;
    height: 2px;
    background: #000;
  }

  .left-line {
    left: 35%;
    transform: rotate(-30deg);
    transform-origin: right;
  }

  .right-line {
    right: 35%;
    transform: rotate(30deg);
    transform-origin: left;
  }

  .thickness {
    position: absolute;
    left: 20%;
    top: 45%;
    font-size: 12px;
    &::before {
      content: "5";
    }
  }
`;

const WeldBuildupDiagram = styled.div`
  width: 300px;
  height: 100px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #000;
  }

  .weld {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 20px;
    border: 2px solid #000;
    border-radius: 20px 20px 0 0;
  }

  .numbers {
    position: absolute;
    top: 70%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    font-size: 14px;

    &::before {
      content: "1";
    }

    &::after {
      content: "2";
    }
  }
`;

export function JointDesign() {
  return (
    <Container>
      <Section>
        <Title>Joint design</Title>
        <DiagramContainer>
          <JointDiagram>
            <div className="left-line" />
            <div className="right-line" />
            <div className="thickness" />
            <span className="angle-right">30°</span>
          </JointDiagram>
        </DiagramContainer>
      </Section>
      <Section>
        <Title>Weld buildup</Title>
        <DiagramContainer>
          <WeldBuildupDiagram>
            <div className="weld" />
            <div className="numbers" />
          </WeldBuildupDiagram>
        </DiagramContainer>
      </Section>
    </Container>
  );
}
