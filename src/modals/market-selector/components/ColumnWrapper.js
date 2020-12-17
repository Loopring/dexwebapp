import { HighlightTextSpan } from 'styles/Styles';
import I from 'components/I';
import React from 'react';

import styled, { withTheme } from 'styled-components';

const NewSpan = styled.div`
  margin-left: 10px;
  font-weight: 400;
  font-size: 0.85rem;
  color: #ffffff;
  background: ${(props) => props.theme.red};
  border-radius: 3px;
  display: inline-block;
  padding: 0px 6px 0px 4px;
  margin: auto;
  font-style: italic;
`;

class ColumnWrapper extends React.Component {
  render() {
    const { theme, row1 } = this.props;
    // Handle BTC price
    let formatedRow1;
    if (isNaN(row1) === false && Number(row1) > 4000) {
      formatedRow1 = Number(row1).toFixed(2);
    } else {
      formatedRow1 = row1;
    }

    return (
      <div>
        <div
          style={{
            textAlign: this.props.textAlign,
            display: 'flex',
          }}
        >
          <div
            style={{
              width: this.props.isNew === true ? 'unset' : '100%',
            }}
          >
            <HighlightTextSpan
              style={{
                textAlign: this.props.textAlign,
                whiteSpace: 'nowrap',
              }}
            >
              {formatedRow1}
            </HighlightTextSpan>
          </div>
          {this.props.isNew === true ? (
            <NewSpan>
              {' '}
              <I s="New" />{' '}
            </NewSpan>
          ) : null}
        </div>
        <div
          style={{
            textAlign: this.props.textAlign,
            whiteSpace: 'nowrap',
            color: this.props.row2Color ? this.props.row2Color : theme.textDim,
            paddingRight: '0px',
            fontWeight: '400',
            fontSize: '0.85rem',
          }}
        >
          {this.props.row2}
        </div>
      </div>
    );
  }
}

export default withTheme(ColumnWrapper);
