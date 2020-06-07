import { Input } from "antd";
import { withTheme } from "styled-components";
import React from "react";

class NumericInput extends React.Component {
  onChange = (e) => {
    // Avoid invalid input that may cause crash
    try {
      const { value } = e.target;
      let { decimals } = this.props;
      if (typeof decimals === "undefined") decimals = 100;
      const reg = new RegExp(
        "^-?(0|[1-9][0-9]*)(\\.[0-9]{0," + decimals + "})?$"
      );
      if (
        (!Number.isNaN(value) && reg.test(value)) ||
        value === "" ||
        value === "-"
      ) {
        this.props.onChange(value);
      } else if (!isNaN(value) && value.toString().indexOf(".") !== -1) {
        // If string contains only one .
        const valueInFloat = parseFloat(value);
        if (valueInFloat === 0) {
          // 00000
          // 000.00 => 0.00
          this.props.onChange("0" + value.replace(/^0+/, ""));
        } else if (valueInFloat > 0) {
          // input has too many decimals. This will be caught in the parent component.
          this.props.onChange(value);
        }
      } else if (/^0*$/.test(value)) {
        // If string contains only 0
        this.props.onChange(value);
      } else if (value === ".") {
        // . => 0.
        this.props.onChange("0.");
      } else {
        // 0000000
        // 00001000 => 1000
        const removedFirstZerosValue = value.replace(/^0+/, "");
        if (
          !Number.isNaN(removedFirstZerosValue) &&
          reg.test(removedFirstZerosValue)
        ) {
          this.props.onChange(removedFirstZerosValue);
        }
      }
    } catch (error) {}
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    try {
      const { value, onBlur, onChange } = this.props;
      if (value && (value.charAt(value.length - 1) === "." || value === "-")) {
        onChange(value.slice(0, -1));
      }
      if (onBlur) {
        onBlur();
      }
    } catch (error) {}
  };

  defaultOnKeyDown = () => {};

  render() {
    const { value, suffix } = this.props;
    let { fontSize } = this.props;
    if (fontSize) {
    } else {
      fontSize = "0.9em";
    }

    return (
      <Input
        autoComplete={"off"}
        value={value}
        onChange={this.onChange}
        onClick={this.props.onClick}
        onBlur={this.onBlur}
        placeholder={Number(0).toFixed(this.props.decimals)}
        maxLength={25}
        style={{
          width: "100%",
          background: "transparent",
          color: this.props.color
            ? this.props.color
            : this.props.theme.textWhite,
        }}
        suffix={
          <div
            style={{
              color: this.props.color
                ? this.props.color
                : this.props.theme.textWhite,
              fontSize: fontSize,
              userSelect: "none",
              lineHeight: "40px",
            }}
          >
            {suffix}
          </div>
        }
        onKeyDown={this.props.onKeyDown}
        disabled={this.props.disabled}
      />
    );
  }
}

export default withTheme(NumericInput);
