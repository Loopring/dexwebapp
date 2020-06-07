import { Translation } from "react-i18next";
import React from "react";

const I = ({ s }) => {
  return <Translation>{(t) => t(s)}</Translation>;
};

export default I;
