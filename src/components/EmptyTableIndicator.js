import I from './I';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const EmptyTableIndicatorWrapper = styled.div`
  text-align: center;
  padding: 0;
  color: ${(props) => props.theme.textDim};

  > img {
    @media (max-height: 200px) {
      display: none;
    }
  }
`;

const EmptyTableIndicator = ({ text, ...props }) => {
  const theme = useContext(ThemeContext);
  if (props.loading) {
    return <div />;
  }

  return (
    <EmptyTableIndicatorWrapper>
      <img
        style={{
          marginTop: props.marginTop,
          width: '68px',
          height: 'auto',
          userSelect: 'none',
          opacity: '1',
        }}
        src={`/assets/images/${theme.imgDir}/no-data.svg`}
        alt="No Data"
        draggable="false"
      />
      <div
        style={{
          paddingTop: '2px',
          fontSize: '0.85rem',
          marginBottom: props.marginTop,
        }}
      >
        <I s={text} />
      </div>
    </EmptyTableIndicatorWrapper>
  );
};

EmptyTableIndicator.defaultProps = {
  marginTop: '10%',
  loading: false,
};

export default EmptyTableIndicator;
