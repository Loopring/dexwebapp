let schemas = {
  STRING: {
    type: "string",
    required: true,
  },
  URL: {
    type: "url",
    required: true,
  },
  ADDRESS: {
    type: "string",
    required: true,
    pattern: /^0x[0-9a-fA-F]{40}$/g,
  },
  HEX: {
    type: "string",
    required: true,
    pattern: /^0x[0-9a-fA-F]*$/g,
  },
  ETH_DATA: {
    type: "string",
    required: true,
    pattern: /^0x[0-9a-fA-F]{1,64}$/g,
  },
  TX_HASH: {
    type: "string",
    required: true,
    pattern: /^0x[0-9a-fA-F]{64}$/g,
  },
  RPC_TAG: {
    type: "enum",
    required: true,
    enum: ["latest", "earliest", "pending"],
  },
  TX: {
    type: "object",
    required: true,
    fields: {
      from: {
        type: "string",
        required: true,
        pattern: /^0x[0-9a-fA-F]{40}$/g,
      },
      to: {
        type: "string",
        required: true,
        pattern: /^0x[0-9a-fA-F]{40}$/g,
      },
      value: {
        type: "string",
        required: true,
        pattern: /^[0-9]*$/g,
      },
      gas: {
        type: "string",
        required: true,
        pattern: /^[1-9][0-9]*$/g,
      },
      gasPrice: {
        type: "string",
        required: true,
        pattern: /^[1-9][0-9]*$/g,
      },
      chainId: {
        type: "number",
        required: true,
      },
      nonce: {
        type: "string",
        required: true,
        pattern: /^[0-9]*$/g,
      },
      data: {
        type: "string",
        required: true,
        pattern: /^0x[0-9a-fA-F]*$/g,
      },
      signed: {
        type: "string",
      },
    },
  },
};

export default schemas;
