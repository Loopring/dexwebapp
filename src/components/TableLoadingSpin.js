import { Spin } from 'antd';
import { ThemeContext } from 'styled-components';

import React, { useContext } from 'react';

const TableLoadingSpin = ({ children, loading }) => {
  const theme = useContext(ThemeContext);
  return (
    <Spin
      spinning={loading ? true : false}
      size="large"
      indicator={
        <img
          alt="loading..."
          src={`/assets/images/${theme.imgDir}/bars.svg`}
          style={{
            marginTop: '100px',
            height: '40px',
            opacity: '1',
          }}
        />
      }
    >
      {children}
    </Spin>
  );
};

export default TableLoadingSpin;
