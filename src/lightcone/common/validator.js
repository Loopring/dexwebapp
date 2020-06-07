import Schema from "async-validator";
import schemas from "./schemas";

let handleErrors = (errors) => {
  let msgs = errors.map((err) => err.message).join();
  throw new Error(`data type invalid: ${msgs} \n`);
};

export default async function validate(payload) {
  let { type, value, onError, onSuccess } = payload;
  let source = {};
  let schema = {};

  if (typeof value === "undefined") {
    throw new Error(`data type invalid: ${type} should not be undefined`);
  }
  if (value === null) {
    throw new Error(`data type invalid: ${type} should not be null`);
  }

  if (schemas[type]) {
    schema[type] = schemas[type];
    source[type] = value;
  }

  let validator = new Schema(schema);
  await validator.validate(source, (errors, fields) => {
    if (errors) {
      if (onError) {
        onError(errors, fields);
      } else {
        handleErrors(errors, fields);
      }
    } else {
      if (onSuccess) {
        onSuccess();
      }
    }
  });
}
