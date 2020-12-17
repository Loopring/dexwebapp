import { updateHistoryOrderOffset } from 'redux/actions/MyOrders';
import { useDispatch, useSelector } from 'react-redux';
import OrderBaseTable from './components/OrderBaseTable';
import React from 'react';

const HistoricalOrders = () => {
  const myOrders = useSelector((state) => state.myOrders);
  const dispatch = useDispatch();

  function onChange(page) {
    const offset = myOrders.historyOrdersLimit * (page - 1);
    dispatch(updateHistoryOrderOffset(offset));
  }

  const current =
    Math.floor(myOrders.historyOrdersOffset / myOrders.historyOrdersLimit) + 1;
  return (
    <OrderBaseTable
      placeHolder="NoHistoryOrders"
      data={myOrders.historyOrders}
      total={myOrders.historyOrdersTotalNum}
      limit={myOrders.historyOrdersLimit}
      offset={myOrders.historyOrdersOffset}
      current={current}
      onChange={onChange}
    />
  );
};

export default HistoricalOrders;
