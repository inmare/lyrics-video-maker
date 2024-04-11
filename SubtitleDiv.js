class Subtitle {
  constructor({ length, time, context }) {
    this._length = length;
    this._time = time;
    this._context = context;
  }

  setLength(length) {
    this._length = length;
  }

  setTime(time) {
    this._time = time;
  }

  setContext(context) {
    this._context = context;
  }
}

export default class SubtitleDiv extends Subtitle {
  constructor({ length, time, context }) {
    super({ length, time, context });
    this.div = document.createElement("div");
    this.div.style.width = `${length}px`;
    this.div.style.left = `${time}px`;
    this.div.innerHTML = context;
    this.div.classList.add("subtitle");
    this.div.onclick = () => {
      this.highlightDiv();
    };
  }

  highlightDiv(subtitleArray) {
    for (let sub of subtitleArray) {
      sub.div.classList.remove("highlight");
    }
    this.div.classList.toggle("highlight");
  }
}
