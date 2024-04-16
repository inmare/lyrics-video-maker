import { SECOND_LEN_PX } from "./globals";

function time2px(time) {
  return Math.round(time * SECOND_LEN_PX);
}

function px2time(px) {
  return Math.round((px / SECOND_LEN_PX) * 1000) / 1000;
}

export { time2px, px2time };
