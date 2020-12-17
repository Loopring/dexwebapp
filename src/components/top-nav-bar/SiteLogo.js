import { ThemeContext } from 'styled-components';
import { Tooltip } from 'antd';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React, { useContext } from 'react';

import config from 'lightcone/config';

const SiteLogo = ({ pushToPage }) => {
  const theme = useContext(ThemeContext);

  // TODO: need to disable the img click
  const onMaintenancePage = window.location.pathname.includes('/maintenance');

  return (
    <div
      style={{
        paddingLeft: '4px',
        fontWeight: 700,
        fontSize: '0.9rem',
        color: theme.textWhite,
        height: AppLayout.topNavBarHeight,
        lineHeight: AppLayout.topNavBarHeight,
        userSelect: 'none',
      }}
    >
      <div>
        <img
          src="/assets/images/logo.svg"
          alt="Loopring"
          draggable="false"
          style={{
            width: '100px',
            height: 'auto',
            marginLeft: '-8px',
            paddingRight: '8px',
            paddingBottom: '4px',
            userSelect: 'none',
          }}
          onClick={() => {
            if (onMaintenancePage === false) {
              pushToPage();
            }
          }}
        />
        <Tooltip
          style={{
            width: '400px',
          }}
          mouseEnterDelay={1}
          title={
            <div>
              <div>LAST_COMMIT={process.env.COMMITHASH}</div>
              <div>DEPLOYED={process.env.TIME}</div>
              <div>RELAYER={config.getRelayerHost()}</div>
            </div>
          }
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 400,
              marginRight: '32px',
              minWidth: '50px',
              display: 'inline-block',
              color: theme.primary,
            }}
          >
            <I s={'v2'} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default SiteLogo;
