import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HighlightTextSpan, RegularTextSpan } from 'styles/Styles';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import I from 'components/I';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const Card = styled.div`
  padding: 0px;
  min-height: 128px;
  background: ${(props) => props.theme.foreground};
  border: none;
  text-align: center;
`;

const TitleDiv = styled.div`
  padding: 20px 20px 0px 20px;
  user-select: none;
`;

const ContentDiv = styled.div`
  padding: 0px 20px 20px;
  color: ${(props) => props.theme.textWhite};
`;

const BalanceHeaderEstimatedValue = ({
  title,
  isLoading,
  estimatedValue,
  sum,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <Card>
      <div>
        <TitleDiv>
          <HighlightTextSpan>
            <I s={title} />
          </HighlightTextSpan>
        </TitleDiv>
        <ContentDiv>
          {isLoading ? (
            <FontAwesomeIcon
              style={{
                display: 'inline-block',
                margin: '24px',
                width: '14px',
                height: '14px',
              }}
              color={theme.textDim}
              icon={faCircleNotch}
              spin={true}
            />
          ) : (
            <div>
              <div>
                <HighlightTextSpan style={{ fontSize: '2rem' }}>
                  {estimatedValue}
                </HighlightTextSpan>
              </div>
              <div style={{ marginTop: '0px' }}>
                <RegularTextSpan>≈ {sum} </RegularTextSpan>
              </div>
            </div>
          )}
        </ContentDiv>
      </div>
    </Card>
  );
};

export default BalanceHeaderEstimatedValue;
