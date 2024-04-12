import LyricsDiv from "./LyricsDiv";
import LyricsArray from "./LyricsArray";
import { LYRICS_FORMAT, SECOND_LEN_PX } from "./globals";

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
    shiftX = e.clientX - LYRICS_ARRAY.selected.getDivStartPos();
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
      const time = e.clientX - shiftX + scroll;
      LYRICS_ARRAY.selected.setTime(time);
      isMouseMoving = true;

      const nextLyrics =
        LYRICS_ARRAY[LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) + 1];

      if (nextLyrics) {
        const divXLimit = nextLyrics.getDivStartPos() - 1;
        const currentDivEnd = time + LYRICS_ARRAY.selected.getLength();
        if (currentDivEnd > divXLimit) {
          LYRICS_ARRAY.selected.setTime(
            divXLimit - LYRICS_ARRAY.selected.getLength(),
          );
        }
      }

      const prevLyrics =
        LYRICS_ARRAY[LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) - 1];

      if (prevLyrics) {
        const divXLimit =
          prevLyrics.getDivStartPos() + prevLyrics.getLength() - 1;
        if (time < divXLimit) {
          LYRICS_ARRAY.selected.setTime(divXLimit);
        }
      } else if (
        !prevLyrics &&
        LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) === 0
      ) {
        const devXLimit = 0;
        if (time < devXLimit) {
          LYRICS_ARRAY.selected.setTime(devXLimit);
        }
      }
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
  const tempTimelineLength = SECOND_LEN_PX * 120;
  const markTimeGap = SECOND_LEN_PX;
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
  lyricsDiv.setLength(SECOND_LEN_PX * 4);
  lyricsDiv.setContext("Lyrics");

  if (LYRICS_ARRAY.length > 0) {
    const lastSubtitle = LYRICS_ARRAY[LYRICS_ARRAY.length - 1];
    lyricsDiv.setTime(lastSubtitle.getTime() + lastSubtitle.getLength());
  }

  LYRICS_ARRAY.push(lyricsDiv);
  lyricsContainer.appendChild(lyricsDiv.getDiv());
}
