import { Layout } from 'antd';
import { ThemeContext } from 'styled-components';
import AppLayout from 'AppLayout';
import I from 'components/I';
import React, { useContext } from 'react';

const { Content } = Layout;

const NotFoundPage = () => {
  const theme = useContext(ThemeContext);
  const rotation = -Math.random() * 45;
  const rotation2 = -rotation;
  return (
    <div>
      <div
        style={{
          height: AppLayout.borderWidth,
          backgroundColor: theme.seperator,
        }}
      />
      <Layout
        hasSider={false}
        style={{
          height: AppLayout.simpleSecondaryPageHeight,
        }}
      >
        <Content
          width="100%"
          style={{
            paddingTop: '0px',
            backgroundColor: theme.foreground,
            borderLeftStyle: 'none',
          }}
        >
          <div
            style={{
              width: '60%',
              minHeight: '50vh',
              margin: 'auto',
              marginTop: '20vh',
              backgroundSize: 'contain',
              backgroundPosition: 'bottom',
              backgroundImage: `url("./assets/images/${theme.imgDir}/404.png")`,
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'color-dodge',
              transform: 'rotate(' + rotation + 'deg)',
            }}
          >
            <div
              style={{
                fontWeight: '600',
                fontSize: '6rem',
                marginTop: '0%',
                marginLeft: '20%',
                color: theme.primary,
                userSelect: 'none',
                transform: 'rotate(' + rotation2 + 'deg)',
              }}
            >
              <I s="404" />
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  color: theme.textWhite,
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <I s="404title" />
              </div>
              <div
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 'normal',
                  background: theme.foreground,
                  width: '240px',
                  color: theme.textDim,
                }}
              >
                <I s="If you believe this is indeed a bug, please " />
                <a href="mailto:foundation@loopring.org">
                  <I s="contact us" />
                </a>
                <I s=". We would appreciate your feedback." />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default NotFoundPage;
