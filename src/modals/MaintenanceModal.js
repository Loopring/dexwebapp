import { MyModal } from "./styles/Styles";
import { withTheme } from "styled-components";
import AppLayout from "AppLayout";
import I from "components/I";
import React from "react";

import { Instruction, Section, TextPopupTitle } from "modals/styles/Styles";

class MaintenanceModal extends React.Component {
  render() {
    const theme = this.props.theme;
    return (
      <div>
        <MyModal
          centered
          width={AppLayout.modalWidth}
          title={
            <TextPopupTitle>
              <I s="MaintenanceModalTitle" />
            </TextPopupTitle>
          }
          closable={false}
          footer={null}
          visible={this.props.isVisible}
        >
          <Section style={{ textAlign: "center" }}>
            <img
              width="120px"
              height="120px"
              draggable="false"
              style={{
                borderRadius: "50%",
                border: "6px solid " + theme.red,
                padding: "16px",
                margin: "30px",
                userSelect: "none",
              }}
              alt="maintaince"
              src={`/assets/images/${theme.imgDir}/maintain.svg`}
            />
            <Instruction
              style={{
                paddingTop: "20px",
                textAlign: "center",
              }}
            >
              <p>
                <I s="MaintenanceModalInstruction1" />
              </p>
              <p>
                <I s="MaintenanceModalInstruction2" />
              </p>
            </Instruction>
          </Section>
        </MyModal>
      </div>
    );
  }
}

export default withTheme(MaintenanceModal);
