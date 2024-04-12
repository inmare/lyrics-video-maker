import LyricsDiv from "./LyricsDiv";
import LyricsArray from "./LyricsArray";
import { LYRICS_FORMAT } from "./globals";

const LYRICS_ARRAY = new LyricsArray();

const addLyricsBtn = document.querySelector("#add-lyrics");
addLyricsBtn.addEventListener("click", addLyricsDiv);

const timelineWrapper = document.querySelector("#timeline-wrapper");
const timeline = document.querySelector("#timeline");
const markContainer = document.querySelector("#mark-container");
const lyricsContainer = document.querySelector("#lyrics-container");

let shiftX = null;
let isMouseDown = false;
let isMouseMoving = false;

document.addEventListener("mousedown", (e) => {
  // check the clicked element is lyrics
  if (e.target.classList.contains("lyrics")) {
    // if lyrics div is clicked, then toggle highlight
    if (LYRICS_ARRAY.selected === null) {
      LYRICS_ARRAY.selected = LYRICS_ARRAY.find(
        (lyrics) => lyrics.getDiv() === e.target,
      );
      LYRICS_ARRAY.selected.toggleHighlight();
    } else if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
      LYRICS_ARRAY.selected.toggleHighlight();
      LYRICS_ARRAY.selected = LYRICS_ARRAY.find(
        (lyrics) => lyrics.getDiv() === e.target,
      );
      LYRICS_ARRAY.selected.toggleHighlight();
    }
    shiftX =
      e.clientX - LYRICS_ARRAY.selected.getDiv().getBoundingClientRect().left;
    isMouseDown = true;
  } else {
    // if clicked other part of the screen, then remove highlight
    if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
      LYRICS_ARRAY.selected.toggleHighlight();
      LYRICS_ARRAY.selected = null;
    }
  }
});

document.addEventListener("mousemove", (e) => {
  // move lyrics div when mouse is down and lyrics is selected
  if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
    if (isMouseDown) {
      const scroll = timelineWrapper.scrollLeft;
      console.log(scroll);
      const time = e.clientX - shiftX + scroll;
      LYRICS_ARRAY.selected.setTime(time);
      isMouseMoving = true;
    }
  }
});

document.addEventListener("mouseup", (e) => {
  // when mouse is up, then set the time of the selected lyrics
  if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
    if (isMouseMoving && isMouseDown) {
      const offset = e.clientX - LYRICS_ARRAY.selected.getTime();
      const time = e.clientX - offset;
      LYRICS_ARRAY.selected.setTime(time);
    }
    isMouseDown = false;
    isMouseMoving = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
});

function initTimeline() {
  const tempTimelineLength = 2000;
  const markTimeGap = 50;
  timeline.style.width = `${tempTimelineLength}px`;

  for (let i = 0; i < tempTimelineLength; i += markTimeGap) {
    const mark = document.createElement("div");
    mark.classList.add("mark");
    mark.style.left = `${i}px`;
    markContainer.appendChild(mark);
  }
}

function addLyricsDiv() {
  const lyricsDiv = new LyricsDiv(LYRICS_FORMAT);
  lyricsDiv.setTime(0);
  lyricsDiv.setLength(100);
  lyricsDiv.setContext("Lyrics");

  if (LYRICS_ARRAY.length > 0) {
    const lastSubtitle = LYRICS_ARRAY[LYRICS_ARRAY.length - 1];
    lyricsDiv.setTime(lastSubtitle.getTime() + lastSubtitle.getLength());
  }

  LYRICS_ARRAY.push(lyricsDiv);
  lyricsContainer.appendChild(lyricsDiv._div);
}
