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
  height: ${(props) => (props.small ? '32px' : '40px')};
  border-radius: 4px;
  width: 100%;
  background: ${(props) => props.theme.foreground};
  font-size: ${(props) => (props.small ? '0.85rem' : '0.9rem')};
  border: 1px solid ${(props) => props.theme.inputBorderColor}!important;

  &:hover, &:focus  {
    background: ${(props) => props.theme.foreground}!important;
    border 1px solid  ${(props) =>
      props.theme.inputBorderActiveColor}!important;
    color: ${(props) => props.theme.textBright};
  }
`;

const AssetDropdown = ({ options, selected, small }) => {
  const theme = useContext(ThemeContext);
  return (
    <Dropdown trigger={['click']} overlay={<AssetMenu>{options}</AssetMenu>}>
      <AssetDropdownButton
        style={{
          paddingLeft: '8px',
          paddingRight: '8px',
        }}
        small={small}
      >
        <Row
          gutter={16}
          style={{
            paddingBottom: '1px',
          }}
        >
          <Col
            span={16}
            style={{
              textAlign: 'left',
              color: theme.textWhite,
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
            <FontAwesomeIcon icon={faCaretDown} />
          </Col>
        </Row>
      </AssetDropdownButton>
    </Dropdown>
  );
};

export default AssetDropdown;
