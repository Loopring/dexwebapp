import styled from "styled-components";

import { Modal } from "antd";

const TextFormError = styled.span`
  color: ${(props) => props.theme.red};
  font-size: 0.9rem;
`;

const TextPopupTitle = styled.span`
  color: ${(props) => props.theme.textBright};
  font-size: 1.2rem;
  font-weight: 600;
  user-select: none;
`;

const AddressDiv = styled.div`
  padding: 10.5px 16px;
  height: 40px;
  background: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.textDim};
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.inputBorderColor};
  font-size: 0.9rem;
`;

const Instruction = styled.p`
  color: ${(props) => props.theme.textWhite};
  font-weight: 400;
  font-size: 0.9rem;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 18px;
  color: ${(props) => props.theme.textWhite};
  font-weight: 400;
  font-size: 0.9rem;

  ul {
    padding-inline-start: 16px;
  }
`;

const MyModal = styled(Modal)`
  .ant-spin-blur {
    opacity: 0 !important;
    max-height: ${(props) =>
      props.maxHeight ? `${props.maxHeight} !important` : `unset`};
  }
`;

export {
  MyModal,
  TextFormError,
  TextPopupTitle,
  AddressDiv,
  Instruction,
  Section,
};
