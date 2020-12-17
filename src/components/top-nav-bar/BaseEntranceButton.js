import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppLayout from 'AppLayout';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const BaseEntranceButtonStyled = styled(Button)`
  cursor: pointer;
  margin-left: 6px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;

  &:hover {
    border-radius: 4px;
    // border: 1px solid ${(props) =>
      props.color || props.theme.primary} !important;
  }

  .svg-inline--fa {
    padding-top: 1px !important;
  }
`;

const BaseEntranceButton = ({
  icon,
  spin,
  title,
  color,
  backgroundcolor,
  onMouseEnter,
  onClick,
  minWidth = '164px',
  marginRight = '12px',
}) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: AppLayout.topNavBarHeight,
      }}
    >
      <div onMouseEnter={onMouseEnter}>
        <BaseEntranceButtonStyled
          onClick={onClick}
          color={color || theme.textWhite}
          style={{
            border: `1px solid ${backgroundcolor}`,
            color: color || theme.textWhite,
            backgroundColor: backgroundcolor,
            minWidth: minWidth,
            marginRight: marginRight,
          }}
        >
          {icon ? (
            <FontAwesomeIcon
              style={{
                width: '14px',
                height: '14px',
                marginRight: '8px',
              }}
              icon={icon}
              spin={spin || false}
            />
          ) : (
            <div />
          )}

          <span>{title}</span>
        </BaseEntranceButtonStyled>
      </div>
    </div>
  );
};

export default BaseEntranceButton;
