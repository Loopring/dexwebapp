import PropTypes from "prop-types";
import styled from "styled-components";

const StickyContainer = styled.div`
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  position: absolute;
  background: ${(props) => props.theme.foreground};
`;

StickyContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StickyContainer;
