import PropTypes from 'prop-types';
import styled from 'styled-components';

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
`;

Panel.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Panel;
