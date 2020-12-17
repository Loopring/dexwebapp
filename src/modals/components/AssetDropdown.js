import { Button, Col, Dropdown, Menu, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import React, { useContext } from 'react';

import styled, { ThemeContext } from 'styled-components';

const AssetMenu = styled(Menu)`
  background: ${(props) => props.theme.sidePanelBackground}!important;
  max-height: 260px;
  overflow-y: scroll;

  li {
    padding-left: 16px;
    border-bottom: 1px solid ${(props) => props.theme.seperator}!important;

    :hover {
      background: ${(props) => props.theme.primary} !important;
      color: ${(props) => props.theme.textBigButton} !important;
    }
  }
`;

const AssetDropdownButton = styled(Button)`
  height: ${(props) => {
    if (props.size) {
      if (props.size === 'small') {
        return '32px';
      } else if (props.size === 'large') {
        return '48px';
      }
    }
    return '40px';
  }};
  width: 100%;
  background: ${(props) => props.theme.foreground};
  font-size: ${(props) => {
    if (props.size) {
      if (props.size === 'small') {
        return '0.85rem';
      } else if (props.size === 'large') {
        return '1.2rem';
      }
    }
    return '0.9rem';
  }};
  border: 1px solid ${(props) => props.theme.inputBorderColor}!important;

  &:hover, &:focus  {
    background: ${(props) => props.theme.foreground}!important;
    border 1px solid  ${(props) =>
      props.theme.inputBorderActiveColor}!important;
    color: ${(props) => props.theme.textBright};
  }

  .ant-btn-icon-only {
    height: 60%!important;;
    margin-top: ${(props) => {
      if (props.size) {
        if (props.size === 'small') {
          return '1px!important;';
        } else if (props.size === 'large') {
          return '2px!important;';
        }
      }
      return '1px!important;';
    }};
  }
`;

export const ArrowDownButton = styled(Button)`
  text-align: right;
  background-color: ${(props) => props.theme.foreground} !important;
  border: none !important;
  &[disabled],
  &:hover {
    border: none;
    background-color: ${(props) => props.theme.foreground} !important;
    color: ${(props) => props.theme.primary} !important;
  }
  &[disabled] {
    color: ${(props) => props.theme.foreground} s !important;
  }
`;

const AssetDropdown = ({
  options,
  selected,
  size,
  paddingLeft,
  paddingRight,
  borderRadius,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <Dropdown trigger={['click']} overlay={<AssetMenu>{options}</AssetMenu>}>
      <AssetDropdownButton
        style={{
          paddingLeft: paddingLeft ? paddingLeft : '8px',
          paddingRight: paddingRight ? paddingRight : '8px',
          borderRadius: borderRadius ? borderRadius : '4px',
        }}
        size={size}
      >
        <Row
          gutter={16}
          style={{
            paddingBottom: '1px',
            height: '100%',
          }}
        >
          <Col
            span={16}
            style={{
              textAlign: 'left',
              color: theme.textWhite,
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            {selected}
          </Col>
          <Col
            span={8}
            style={{
              textAlign: 'right',
              color: theme.primary,
            }}
          >
            <ArrowDownButton
              icon={
                <FontAwesomeIcon
                  style={{
                    color: theme.primary,
                    fontSize: '18px',
                  }}
                  icon={faCaretDown}
                />
              }
            />
          </Col>
        </Row>
      </AssetDropdownButton>
    </Dropdown>
  );
};

export default AssetDropdown;
