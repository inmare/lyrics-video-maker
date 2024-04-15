import { SECOND_LEN_PX } from "./globals";

export default class Lyrics {
  constructor({ startTime, duration, context }) {
    // time, duration : 소수점 세자리까지 표현된 초
    this._startTime = startTime;
    this._endTime = startTime + duration;
    this._duration = duration;
    this._context = context;
    // 시간을 초 단위로 바꾸기
    // this._formattedTime = this._formatTime(time);
    // div 생성하기
    this._div = this._initDiv();
    this._hightlightDiv = this._initHighlightDiv();
  }

  setTime(startTime) {
    this._startTime = startTime;
    const timePx = this._time2Px(startTime);
    this._div.style.left = `${timePx}px`;
    // this._formattedTime = this._formatTime(time, this._length);
  }

  setDuration(duration) {
    this._duration = duration;
    const durationPX = this._duration2Px(duration);
    this._div.style.width = `${durationPX}px`;
    // this._formattedTime = this._formatTime(this._time, length);
  }

  setContext(context) {
    this._context = context;
    this._setDivContext(context);
  }

  _time2Px(time) {
    return Math.round(time * SECOND_LEN_PX);
  }

  _duration2Px(duration) {
    return Math.round(duration * SECOND_LEN_PX);
  }

  getDuration() {
    return this._duration;
  }

  getStartTime() {
    return this._startTime;
  }

  getContext() {
    return this._context;
  }

  getDiv() {
    return this._div;
  }

  enableHighlight() {
    this._hightlightDiv.style.display = null;
  }

  disableHighlight() {
    this._hightlightDiv.style.display = "none";
  }

  getDivStartPos() {
    return this._div.getBoundingClientRect().left;
  }

  toggleHighlight() {
    this._div.classList.toggle("lyrics-highlight");
  }

  _formatTime(time, length) {
    const startTimePx = time;
    const endTimePx = time + length;

    const startTime = this._px2timeInfo(startTimePx);
    const endTime = this._px2timeInfo(endTimePx);

    return {
      startTime: startTime,
      endTime: endTime,
    };
  }

  getFormattedStartTime() {
    return this._formattedTime.startTime;
  }

  getFormattedEndTime() {
    return this._formattedTime.endTime;
  }

  _px2timeInfo(timePx) {
    const actualSecond = timePx / SECOND_LEN_PX;
    const min = Math.floor(actualSecond / 60);
    const sec = Math.floor(actualSecond) % 60;
    const msec = Math.round((actualSecond - Math.floor(actualSecond)) * 1000);

    const minStr = min.toString().padStart(2, "0");
    const secStr = sec.toString().padStart(2, "0");
    const msecStr = msec.toString().padStart(3, "0");

    return {
      num: [min, sec, msec],
      str: [minStr, secStr, msecStr],
    };
  }

  _initDiv() {
    const div = document.createElement("div");
    div.style.width = `${this._length}px`;
    div.style.left = `${this._startTime}px`;
    div.classList.add("lyrics");

    const p = document.createElement("p");
    p.innerText = this._context;
    p.classList.add("lyrics-context");
    div.appendChild(p);

    return div;
  }

  _setDivContext(context) {
    this._div.querySelector("p").innerText = context;
  }

  _initHighlightDiv() {
    const div = document.createElement("div");
    div.classList.add("lyrics-selected");
    div.style.display = "none";

    for (let i = 0; i < 2; i++) {
      const subDiv = document.createElement("div");
      subDiv.classList.add("lyrics-size-change");
      if (i === 0) {
        subDiv.style.borderTopRightRadius = "0px";
        subDiv.style.borderBottomRightRadius = "0px";
      } else if (i === 1) {
        subDiv.style.borderTopLeftRadius = "0px";
        subDiv.style.borderBottomLeftRadius = "0px";
      }

      div.appendChild(subDiv);
    }

    this._div.appendChild(div);
    return div;
  }
}
