import { updateOpenOrderOffset } from 'redux/actions/MyOrders';
import { useDispatch, useSelector } from 'react-redux';
import OrderBaseTable from './components/OrderBaseTable';
import React from 'react';

const OpenOrders = () => {
  const myOrders = useSelector((state) => state.myOrders);
  const dispatch = useDispatch();

  function onChange(page) {
    const offset = myOrders.openOrdersLimit * (page - 1);
    dispatch(updateOpenOrderOffset(offset));
  }

  const current =
    Math.floor(myOrders.openOrdersOffset / myOrders.openOrdersLimit) + 1;

  return (
    <OrderBaseTable
      placeHolder="NoOpenOrders"
      data={myOrders.openOrders}
      total={myOrders.openOrdersTotalNum}
      limit={myOrders.openOrdersLimit}
      offset={myOrders.openOrdersOffset}
      current={current}
      onChange={onChange}
    />
  );
};

export default OpenOrders;
