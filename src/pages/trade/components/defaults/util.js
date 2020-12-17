const isArrayOrObject = (coll) =>
  Array.isArray(coll) || typeof coll === 'object';

const lengthOrSize = (coll) => coll.length || coll.size;

export const hasReceivedOrderBook = ({ bids, asks }) =>
  isArrayOrObject(bids) &&
  isArrayOrObject(asks) &&
  (lengthOrSize(bids) > 0 || lengthOrSize(asks) > 0);

export const countTrailingZeroes = (numString) => {
  let numZeroes = 0;
  for (let digit of numString.split('').reverse()) {
    if (digit === '0' || digit === 0) {
      numZeroes = numZeroes + 1;
    } else {
      return numZeroes;
    }
  }
  return numZeroes;
};

export const dropTrailingZeroes = (num) => {
  const numString = String(num);
  if (numString) {
    const numTrailingZeroes = countTrailingZeroes(numString);
    const dropedZeroes = numString.substring(
      0,
      numString.length - numTrailingZeroes
    );
    if (dropedZeroes.endsWith('.')) {
      return dropedZeroes.substring(0, dropedZeroes.length - 1);
    } else {
      return dropedZeroes;
    }
  } else {
    return numString;
  }
};
