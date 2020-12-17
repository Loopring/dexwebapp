import styled from 'styled-components';

const BaseHeading = styled.th`
  font-weight: 400;
  text-align: right;
  height: 32px;
  padding: 1px;
`;

const TableColHead = styled(BaseHeading)`
  width: 23%;
`;

const TableColHeadPrice = styled(BaseHeading)`
  width: 33%;
`;

export { TableColHead, TableColHeadPrice };
