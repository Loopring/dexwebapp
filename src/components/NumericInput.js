import { Input } from 'antd';
import { ThemeContext } from 'styled-components';
import React, { useContext } from 'react';

const NumericInput = ({
  decimals,
  onChange,
  value,
  onBlur,
  suffix,
  fontSize,
  onClick,
  color,
  onKeyDown,
  disabled,
  addonAfter,
}) => {
  function inputOnChange(e) {
    // Avoid invalid input that may cause crash
    try {
      const { value } = e.target;
      if (typeof decimals === 'undefined') decimals = 100;
      const reg = new RegExp(
        '^-?(0|[1-9][0-9]*)(\\.[0-9]{0,' + decimals + '})?$'
      );
      if (
        (!Number.isNaN(value) && reg.test(value)) ||
        value === '' ||
        value === '-'
      ) {
        onChange(value);
      } else if (!isNaN(value) && value.toString().indexOf('.') !== -1) {
        // If string contains only one .
        const valueInFloat = parseFloat(value);
        if (valueInFloat === 0) {
          // 00000
          // 000.00 => 0.00
          onChange('0' + value.replace(/^0+/, ''));
        } else if (valueInFloat > 0) {
          // input has too many decimals. This will be caught in the parent component.
          onChange(value);
        }
      } else if (/^0*$/.test(value)) {
        // If string contains only 0
        onChange(value);
      } else if (value === '.') {
        // . => 0.
        onChange('0.');
      } else {
        // 0000000
        // 00001000 => 1000
        const removedFirstZerosValue = value.replace(/^0+/, '');
        if (
          !Number.isNaN(removedFirstZerosValue) &&
          reg.test(removedFirstZerosValue)
        ) {
          onChange(removedFirstZerosValue);
        }
      }
    } catch (error) {}
  }

  // '.' at the end or only '-' in the input box.
  function inputOnBlur() {
    try {
      if (value && (value.charAt(value.length - 1) === '.' || value === '-')) {
        onChange(value.slice(0, -1));
      }
      if (onBlur) {
        onBlur();
      }
    } catch (error) {}
  }

  function defaultOnKeyDown() {}

  if (fontSize) {
  } else {
    fontSize = '0.9em';
  }

  const theme = useContext(ThemeContext);
  return (
    <Input
      autoComplete={'off'}
      value={value}
      onChange={inputOnChange}
      onClick={onClick}
      onBlur={inputOnBlur}
      placeholder={Number(0).toFixed(decimals)}
      maxLength={25}
      style={{
        width: '100%',
        background: 'transparent',
        color: color ? color : theme.textWhite,
      }}
      suffix={
        <div
          style={{
            color: color ? color : theme.textWhite,
            fontSize: fontSize,
            userSelect: 'none',
            lineHeight: '40px',
          }}
        >
          {suffix}
        </div>
      }
      onKeyDown={onKeyDown}
      disabled={disabled}
      addonAfter={addonAfter}
    />
  );
};

export default NumericInput;
