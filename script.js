import SubtitleDiv from "./SubtitleDiv";
import SubtitleArray from "./SubtitleArray";
import { SUBTITLE_FORMAT } from "./globals";

const SUBTITLE_ARRAY = new SubtitleArray();

const addSubtitleBtn = document.querySelector("#add-subtitle");
addSubtitleBtn.addEventListener("click", addSubtitleDiv);

const subtitleContainer = document.querySelector("#subtitle-container");

let shiftX = null;
let isMouseDown = false;
let isMouseMoving = false;

document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("subtitle")) {
    if (SUBTITLE_ARRAY.selected === null) {
      SUBTITLE_ARRAY.selected = SUBTITLE_ARRAY.find(
        (subtitle) => subtitle.getDiv() === e.target,
      );
      SUBTITLE_ARRAY.selected.highlightToggle();
    } else if (SUBTITLE_ARRAY.selected instanceof SubtitleDiv) {
      SUBTITLE_ARRAY.selected.highlightToggle();
      SUBTITLE_ARRAY.selected = SUBTITLE_ARRAY.find(
        (subtitle) => subtitle.getDiv() === e.target,
      );
      SUBTITLE_ARRAY.selected.highlightToggle();
    }
    shiftX =
      e.clientX - SUBTITLE_ARRAY.selected.getDiv().getBoundingClientRect().left;
    isMouseDown = true;
  } else {
    if (SUBTITLE_ARRAY.selected instanceof SubtitleDiv) {
      SUBTITLE_ARRAY.selected.highlightToggle();
      SUBTITLE_ARRAY.selected = null;
    }
  }
});

document.addEventListener("mousemove", (e) => {
  if (SUBTITLE_ARRAY.selected instanceof SubtitleDiv) {
    if (isMouseDown) {
      const time = e.clientX - shiftX;
      SUBTITLE_ARRAY.selected.setTime(time);
      isMouseMoving = true;
    }
  }
});

document.addEventListener("mouseup", (e) => {
  if (SUBTITLE_ARRAY.selected instanceof SubtitleDiv) {
    if (isMouseMoving && isMouseDown) {
      const offset = e.clientX - SUBTITLE_ARRAY.selected.getTime();
      const time = e.clientX - offset;
      SUBTITLE_ARRAY.selected.setTime(time);
    }
    isMouseDown = false;
    isMouseMoving = false;
  }
});

function addSubtitleDiv() {
  const subtitleDiv = new SubtitleDiv(SUBTITLE_FORMAT);
  subtitleDiv.setTime(0);
  subtitleDiv.setLength(100);
  subtitleDiv.setContext("Subtitle");

  if (SUBTITLE_ARRAY.length > 0) {
    const lastSubtitle = SUBTITLE_ARRAY[SUBTITLE_ARRAY.length - 1];
    subtitleDiv.setTime(lastSubtitle.getTime() + lastSubtitle.getLength());
  }

  SUBTITLE_ARRAY.push(subtitleDiv);
  subtitleContainer.appendChild(subtitleDiv._div);
}

window.onmousemove = () => {
  // if mousedown is ture and div is selected, then drag the div
};
