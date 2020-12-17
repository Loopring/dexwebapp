import { Col, Row } from 'antd';
import { Page } from 'pages/account/components/styles/Styles';
import React from 'react';

import CommissionRewardMyRewardPage from './CommissionRewardMyRewardPage';

import Header from 'pages/account/components/Header';

const ReferralRewardsPage = () => {
  return (
    <Page>
      <Header type={'commission-reward'} />
      <Row
        gutter={{ xs: 8, sm: 16, md: 24 }}
        style={{
          marginTop: '0px',
          marginBottom: '20px',
        }}
      >
        <Col span={8}>
          <CommissionRewardMyRewardPage market={'LRC-USDT'} rewardType={2} />
        </Col>
        <Col span={8}>
          <CommissionRewardMyRewardPage market={'LRC-USDT'} rewardType={1} />
        </Col>
        <Col span={8}>
          <CommissionRewardMyRewardPage market={'LRC-USDT'} rewardType={3} />
        </Col>
      </Row>
    </Page>
  );
};

export default ReferralRewardsPage;
