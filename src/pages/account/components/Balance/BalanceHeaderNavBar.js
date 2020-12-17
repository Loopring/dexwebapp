import { Checkbox, Col, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LargeTableHeader, SearchInput } from 'styles/Styles';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { updateHideLowBalanceAssets } from 'redux/actions/MyAccountPage';
import { useDispatch, useSelector } from 'react-redux';
import I from 'components/I';
import React from 'react';

const BalanceHeaderNavBar = ({ loading, onSearchInputChange }) => {
  const balances = useSelector((state) => state.balances);
  const language = useSelector((state) => state.userPreferences.language);
  const dispatch = useDispatch();

  function clicked(e) {
    dispatch(updateHideLowBalanceAssets(e.target.checked));
  }

  function searchInputChange(e) {
    onSearchInputChange(e.target.value);
  }

  // https://github.com/ant-design/ant-design/issues/5866
  let placeholder = language === 'en' ? 'Search asset symbol' : '搜索资产代码';

  return (
    <LargeTableHeader>
      <Row gutter={8}>
        <Col
          style={{
            paddingRight: '0px',
            margin: 'auto 0px',
          }}
        >
          <span>
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </Col>
        <Col
          style={{
            paddingLeft: '0px',
          }}
        >
          <SearchInput
            style={{}}
            disabled={loading}
            placeholder={placeholder}
            onChange={searchInputChange}
          />
        </Col>
        <Col
          style={{
            maxWidth: '20px',
            minWidth: '20px',
          }}
        ></Col>
        <Col span={5}>
          <Checkbox
            style={{
              marginLeft: '4px',
              marginTop: '4px',
              marginBottom: 'auto',
              textTransform: 'none',
            }}
            onChange={clicked}
            defaultChecked={balances.hideLowBalanceAssets}
          >
            <I s="Hide zero-balance assets" />
          </Checkbox>
        </Col>
      </Row>
    </LargeTableHeader>
  );
};

export default BalanceHeaderNavBar;
