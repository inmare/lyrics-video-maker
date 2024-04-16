import { SECOND_LEN_PX } from "./globals";

function time2px(time) {
  return Math.round(time * SECOND_LEN_PX);
}

function px2time(px) {
  return Math.round((px / SECOND_LEN_PX) * 1000) / 1000;
}

function time2str(secNumber) {
  const min = Math.floor(secNumber / 60);
  const sec = Math.floor(secNumber) % 60;
  const msec = Math.floor((secNumber % 1) * 1000);

  const minStr = min.toString().padStart(2, "0");
  const secStr = sec.toString().padStart(2, "0");
  const msecStr = msec.toString().padStart(3, "0");

  return [minStr, secStr, msecStr];
}

export { time2px, px2time, time2str };
