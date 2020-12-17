import * as fm from 'lightcone/common/formatter';
import AnimatedNumber from 'animated-number-react';
import React from 'react';

const SwapBalanceLabel = ({ text, availableAmount, token }) => {
  function formatValue(value) {
    const commas = fm.numberWithCommas(value);
    if (commas) {
      // Avoid animation issue
      return commas.split('.')[0];
    } else {
      return value;
    }
  }

  let swapFrom;
  if (availableAmount && isNaN(Number(availableAmount)) === false) {
    const availableAmountStr = availableAmount.toString();
    if (availableAmountStr.includes('.')) {
      swapFrom = (
        <div
          style={{
            display: 'inline',
            marginLeft: '4px',
          }}
        >
          <AnimatedNumber
            value={availableAmountStr.split('.')[0]}
            formatValue={formatValue}
            duration={0}
          />
          .{availableAmountStr.split('.')[1]}
        </div>
      );
    } else {
      swapFrom = (
        <div
          style={{
            display: 'inline',
          }}
        >
          <AnimatedNumber
            value={availableAmount}
            formatValue={formatValue}
            duration={200}
          />
        </div>
      );
    }
  }

  return (
    <div>
      {text}
      {swapFrom}
    </div>
  );
};

export default SwapBalanceLabel;
