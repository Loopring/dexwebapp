import {
  ActivePoolSectionStyled,
  BottomFormDiv,
  Section,
  TitleLabel,
} from 'pages/swap/components/utils';
import I from 'components/I';
import React from 'react';
import SwapPoolTokenButton from 'pages/swap/components/SwapPoolTokenButton';
import SwapSection from 'pages/swap/components/SwapSection';

const SwapYourPool = ({ myAmmMarkets, onClickSwapYourPool }) => {
  let topSection;
  let activePoolSections = [];
  if (myAmmMarkets) {
    for (let i = 0; i < myAmmMarkets.length; i++) {
      const ammMarket = myAmmMarkets[i];
      const activePoolSection = (
        <SwapPoolTokenButton
          ammMarket={ammMarket}
          cursor="pointer"
          onClickSwapYourPool={() => {
            onClickSwapYourPool(ammMarket);
          }}
        />
      );
      activePoolSections.push(activePoolSection);
    }
    topSection = <div>{activePoolSections.map((x) => x)}</div>;
  }

  let titleLabel;
  if (myAmmMarkets && myAmmMarkets.length == 1) {
    titleLabel = (
      <TitleLabel>
        <I s="My pools" />
      </TitleLabel>
    );
  } else {
    titleLabel = (
      <TitleLabel>
        <I s="My pool" />
      </TitleLabel>
    );
  }

  return (
    <BottomFormDiv>
      <Section
        style={{
          // marginTop: '26px',
          marginTop: '0px',
          marginBottom: '4px',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
        s
      >
        <SwapSection
          leftComponent={
            <TitleLabel>
              <I s="My pools" />
            </TitleLabel>
          }
        />
      </Section>

      <ActivePoolSectionStyled>
        <Section
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {topSection}
        </Section>
      </ActivePoolSectionStyled>
    </BottomFormDiv>
  );
};

export default SwapYourPool;
