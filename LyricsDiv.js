export default class LyricsDiv {
  constructor({ length, time, context }) {
    // set default values
    this._length = length;
    this._time = time;
    this._context = context;
    // creative div
    this._div = this._initDiv();
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
    // this._div.innerHTML = context;
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

  _initDiv() {
    const div = document.createElement("div");
    div.style.width = `${this._length}px`;
    div.style.left = `${this._time}px`;
    div.innerHTML = this._context;
    div.classList.add("lyrics");
    return div;
  }

  getDiv() {
    return this._div;
  }

  setSelectedDiv() {
    const div = document.createElement("div");
    div.classList.add("lyrics-selected");
    this._div.appendChild(div);

    console.log(this._div);
  }

  getDivStartPos() {
    return this._div.getBoundingClientRect().left;
  }

  toggleHighlight() {
    this._div.classList.toggle("lyrics-highlight");
  }
}
