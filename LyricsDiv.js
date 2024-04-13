export default class LyricsDiv {
  constructor({ length, time, context }) {
    // set default values
    this._length = length;
    this._time = time;
    this._context = context;
    // creative div
    this._div = this._initDiv();
    this._hightlightDiv = this._initHighlightDiv();
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
    this._setDivContext(context);
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

  _initDiv() {
    const div = document.createElement("div");
    div.style.width = `${this._length}px`;
    div.style.left = `${this._time}px`;
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
