export const getSize = (data) => data.base_fill_amount;
export const getSide = (data) => (data.is_sell ? "sell" : "buy");
export const getFilled = (data) => data.filled;

export const getPrice = (data) => {
  let price = Number(data.price).toPrecision();
  return price;
};
export const getPosition = (data) => data.position;
export const getTimeStamp = (data) => data.time;

export const getSideFromLightconeData = (data) =>
  data.side.toUpperCase() === "SELL" ? "sell" : "buy";

export const getTimeStampFromLightconeData = (data) => {
  return data.timestamp;
};
