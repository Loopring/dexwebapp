import styled from "styled-components";

const BaseHeader = styled.th`
  font-weight: 400;
  text-align: right;
  height: 32px;
`;

export const OrderBookHeaderPrice = styled(BaseHeader)`
  text-align: left;
  width: 35%;
  padding: 1px 1px 1px 12px;
`;

export const OrderBookHeaderSize = styled(BaseHeader)`
  text-align: right;
  width: 30%;
  padding: 1px 12px 1px 8px;
`;

export const OrderBookHeaderPosition = styled(BaseHeader)`
  text-align: right;
  width: 35%;
  padding: 1px 12px 1px 1px;
`;
