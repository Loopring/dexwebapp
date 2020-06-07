import PropTypes from "prop-types";
import styled from "styled-components";

const AbsoluteContainer = styled.div`
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  background: ${(props) => props.theme.foreground};
`;

AbsoluteContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AbsoluteContainer;
