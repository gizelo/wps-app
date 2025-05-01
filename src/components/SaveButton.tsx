import styled from "styled-components";
import { useWPS } from "../context/WPSContext";

const Button = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  z-index: 1000;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:active {
    background: #004494;
  }
`;

export function SaveButton() {
  const { saveWPSData } = useWPS();

  return <Button onClick={saveWPSData}>Save WPS</Button>;
}
