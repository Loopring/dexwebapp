import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${(props) => props.theme.foreground};
`;

const Scrollable = styled.div`
  width: 100%;
  height: 100%;
`;

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  position: absolute;
`;

const ScrollContainer = ({ scrollerRef, children, ...props }) => (
  <Container {...props}>
    <Scrollable>
      <Scroller ref={scrollerRef} hidden-scrollbars>
        {children}
      </Scroller>
    </Scrollable>
  </Container>
);

ScrollContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollContainer;
