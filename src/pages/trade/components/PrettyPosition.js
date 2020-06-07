import PrettySize from "./PrettySize";
import React from "react";
import styled from "styled-components";

const MedContrast = styled.span`
  color: ${(props) => props.theme.textDim};
`;

const PrettyPosition = ({ position, format, side }) =>
  position && Number(position) ? (
    <PrettySize size={position} format={format} side={side} />
  ) : (
    <MedContrast>-</MedContrast>
  );

export default PrettyPosition;
