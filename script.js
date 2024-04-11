// import SubtitleDiv from "./SubtitleDiv";

let subtitleArray = [];

const addSubtitleBtn = document.querySelector("#add-subtitle");
addSubtitleBtn.addEventListener("click", addSubtitleDiv);

const subtitleContainer = document.querySelector("#subtitle-container");

function addSubtitleDiv() {
  const subtitleInfo = {
    length: 100,
    time: 0,
    context: "test",
  };

  const subtitleDiv = new SubtitleDiv(subtitleInfo);
  if (subtitleArray.length > 0) {
    const lastSubtitle = subtitleArray[subtitleArray.length - 1];
    subtitleDiv.setTime(lastSubtitle.getTime() + lastSubtitle.getLength());
  }
  subtitleArray.push(subtitleDiv);
  subtitleContainer.appendChild(subtitleDiv.div);
}

window.onmousemove = () => {
  // if mousedown is ture and div is selected, then drag the div
};

class SubtitleDiv {
  constructor({ length, time, context }) {
    // set default values
    this._length = length;
    this._time = time;
    this._context = context;
    // creative div
    this.div = document.createElement("div");
    this.div.style.width = `${length}px`;
    this.div.style.left = `${time}px`;
    this.div.innerHTML = context;
    this.div.classList.add("subtitle");
    // this.div.onmousedown = () => {
    //   this.isMousedown = true;
    //   this.highlightDiv();
    // };
    // this.div.onmousemove = (event) => {
    //   this.dragDiv(event);
    // };
    // this.div.onmouseup = () => {
    //   this.isMousedown = false;
    // };
    this.div.onclick = () => {
      this.highlightDiv();
    };
    // div related variable
    this.isMousedown = false;
  }

  setLength(length) {
    this._length = length;
    this.div.style.width = `${length}px`;
  }

  setTime(time) {
    this._time = time;
    this.div.style.left = `${time}px`;
  }

  setContext(context) {
    this._context = context;
    this.div.innerHTML = context;
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

  highlightDiv() {
    for (let sub of subtitleArray) {
      sub.div.classList.remove("highlight");
    }
    // if (this.isMousedown) {
    //   this.div.classList.add("highlight");
    // } else {
    //   this.div.classList.remove("highlight");
    // }
    this.div.classList.toggle("highlight");
  }

  dragDiv(event) {
    // console.log(this.isMousedown);
    if (this.isMousedown) {
      const mousePos = event.clientX;
      const divPos = this.div.getBoundingClientRect().left;
      const diff = mousePos - divPos;
      this.div.style.left = `${mousePos - diff}px`;
    }
  }
}

class SubtitleArray {
  constructor() {
    this._subtitleArray = [];
    this._selected = [];
  }

  static push(subtitle) {
    this._subtitleArray.push(subtitle);
  }
}
