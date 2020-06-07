import axios from "axios";
import config from "../config";

export const SERVER_URL = config.getServer();

/**
 * @description Supports single request and batch request;
 * @param options
 * @param parse
 * @returns {Promise}
 */
export default function request(options, parse) {
  options.timeout = options.timeout || 30000;
  options.baseURL = options.baseURL || SERVER_URL;

  return axios(options).then((response) => {
    if (parse) {
      return parse(response);
    } else {
      return parseResponse(response);
    }
  });
}

function parseResponse(response) {
  const data = response["data"];
  const resultInfo = data["resultInfo"];
  const errorData = data["error"];

  // Some API endpoints in the old versions don't have resultInfo.
  if (resultInfo) {
    const code = resultInfo["code"];
    if (code !== 0) {
      const errorMessage = resultInfo["message"];
      throw Error(errorMessage);
    }
    return data;
  } else if (errorData) {
    const code = errorData["code"];
    if (code !== 0) {
      const errorMessage = `${errorData["code"]} ${errorData["message"]}`;
      throw Error(errorMessage);
    }
    return data;
  } else {
    return data;
  }
}
