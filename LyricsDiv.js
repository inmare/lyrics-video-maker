export default class LyricsDiv {
  constructor({ length, time, context }) {
    // set default values
    this._length = length;
    this._time = time;
    this._context = context;
    // creative div
    this._div = document.createElement("div");
    this._div.style.width = `${length}px`;
    this._div.style.left = `${time}px`;
    this._div.innerHTML = context;
    this._div.classList.add("lyrics");
  }

  setLength(length) {
    this._length = length;
    this._div.style.width = `${length}px`;
  }

  setTime(time) {
    this._time = time;
    this._div.style.left = `${time}px`;
  }

  setContext(context) {
    this._context = context;
    this._div.innerHTML = context;
  }

  getLength() {
    return this._length;
  }

  getTime() {
    return this._time;
  }

  getContext() {
    return this._context;
  }

  getDiv() {
    return this._div;
  }

  toggleHighlight() {
    this._div.classList.toggle("lyrics-highlight");
  }
}
