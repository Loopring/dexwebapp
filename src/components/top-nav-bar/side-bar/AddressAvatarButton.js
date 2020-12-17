import AppLayout from 'AppLayout';
import Blockies from 'react-blockies';
import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'antd';
import I from 'components/I';

const MyBlockies = styled(Blockies)`
  border-radius: 50%;
  width: 36px !important;
  height: 36px !important;
  border: 2px solid ${(props) => props.theme.textWhite};
`;

export const AddressAvatarButton = ({ fullAddress, address }) => {
  const theme = useContext(ThemeContext);
  return (
    <Tooltip
      title={
        <CopyToClipboard text={fullAddress}>
          <div
            style={{
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                width: '152px',
              }}
            >
              {fullAddress}
            </div>
            <div style={{ paddingTop: '8px', fontSize: '0.8rem' }}>
              <I s="Click to copy" />
            </div>
          </div>
        </CopyToClipboard>
      }
      mouseEnterDelay={1}
    >
      <CopyToClipboard text={fullAddress}>
        <div
          style={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            height: AppLayout.topNavBarHeight,
          }}
        >
          <MyBlockies seed={fullAddress} />

          <span
            style={{
              marginLeft: '12px',
              userSelect: 'none',
              color: theme.textWhite,
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            {address}
          </span>
        </div>
      </CopyToClipboard>
    </Tooltip>
  );
};
