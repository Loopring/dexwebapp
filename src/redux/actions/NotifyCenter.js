export const UPDATE_BLOCK_NUM = "UPDATE_BLOCK_NUM";

export function updateBlockNum(blockNum) {
  return {
    type: UPDATE_BLOCK_NUM,
    payload: {
      blockNum,
    },
  };
}
