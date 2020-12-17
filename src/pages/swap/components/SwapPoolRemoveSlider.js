import { Button, Slider } from 'antd';
import { Section } from 'pages/swap/components/utils';
import {
  getSwapPoolRemoveFormType,
  saveSwapPoolRemoveFormType,
} from 'lightcone/api/localStorgeAPI';
import I from 'components/I';
import React, { useContext, useState } from 'react';
import SwapLabelValue from 'pages/swap/components/SwapLabelValue';
import styled, { ThemeContext } from 'styled-components';

const PercentageButton = styled(Button)`
  border: none !important;
  width: 72px !important;
  font-size: 1rem !important;
  margin: 0 !important;
  color: ${(props) => props.theme.textWhite}!important;
  background: ${(props) => props.theme.buttonBackground}!important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  height: 30px;
  border-radius: 6px;

  &[disabled],
  &[disabled]:hover {
    color: ${(props) => props.theme.textDim}!important;
    background: ${(props) => props.theme.buttonBackground}!important;
  }

  &:hover {
    color: ${(props) => props.theme.textBigButton}!important;
    background: ${(props) => props.theme.primary}!important;
  }
`;

const SwapPoolRemoveSlider = ({
  percentage,
  setPercentage,
  percentageOnChange,
  formTypeOnChange,
  disabled,
}) => {
  const [formType, setFormType] = useState(getSwapPoolRemoveFormType());
  const theme = useContext(ThemeContext);

  function handleAmountPercentage(percentage) {
    setPercentage(percentage);
    percentageOnChange(percentage);
  }

  function onSliderChange(value) {
    console.log('value', value);
    setPercentage(value);
    percentageOnChange(value);
  }

  function onFormType() {
    if (formType === 'simple') {
      setFormType('details');
      formTypeOnChange('details');
      saveSwapPoolRemoveFormType('details');
    } else {
      setFormType('simple');
      formTypeOnChange('simple');
      saveSwapPoolRemoveFormType('simple');
    }
  }

  return (
    <Section
      style={{
        marginTop: '0px',
        marginBottom: '0px',
        padding: '12px 18px 0px',
        border: `1px solid ${theme.inputBorderColor}`,
        borderRadius: '12px',
      }}
    >
      <Section
        style={{
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <SwapLabelValue
          labelLeft={
            <div>
              <I s="Amount" />
            </div>
          }
          labelRight={
            <div
              style={{
                color: theme.primary,
                cursor: 'pointer',
              }}
              onClick={onFormType}
            >
              {formType === 'details' ? <I s="Simple" /> : <I s="Details" />}
            </div>
          }
          leftColSpan={12}
          rightColSpan={12}
        />
      </Section>
      <Section>
        <div
          style={{
            marginTop: '0px',
            marginBottom: '0px',
            fontSize: '6rem',
            color: theme.textWhite,
          }}
        >
          {`${percentage}%`}
        </div>
      </Section>
      {formType === 'simple' ? (
        <div
          style={{
            marginBottom: '20px',
            paddingTop: '4px',
          }}
        >
          <Section>
            <Slider
              onChange={onSliderChange}
              step={1}
              defaultValue={0}
              value={percentage}
              min={0}
              max={100}
              disabled={disabled}
            />
          </Section>
          <Section
            style={{
              marginTop: '26px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                margin: '4px 1px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <PercentageButton
                disabled={disabled}
                onClick={() => handleAmountPercentage(25)}
              >
                25%
              </PercentageButton>
              <PercentageButton
                disabled={disabled}
                onClick={() => handleAmountPercentage(50)}
              >
                50%
              </PercentageButton>
              <PercentageButton
                disabled={disabled}
                onClick={() => handleAmountPercentage(75)}
              >
                75%
              </PercentageButton>
              <PercentageButton
                disabled={disabled}
                onClick={() => handleAmountPercentage(100)}
              >
                100%
              </PercentageButton>
            </div>
          </Section>
        </div>
      ) : (
        <div />
      )}
    </Section>
  );
};

export default SwapPoolRemoveSlider;
