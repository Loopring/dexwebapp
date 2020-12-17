import { BottomFormDiv, Section } from 'pages/swap/components/utils';

import I from 'components/I';
import React from 'react';

const SwapAddLiquidityInstruction = () => {
  return (
    <BottomFormDiv
      style={{
        marginBottom: '0px',
      }}
    >
      <Section
        style={{
          paddingTop: '0px',
        }}
      >
        <I s="SwapAddLiquidityInstruction_1" />
        {'0.15%'}
        <I s="SwapAddLiquidityInstruction_2" />
      </Section>
    </BottomFormDiv>
  );
};

export default SwapAddLiquidityInstruction;
