import LyricsDiv from "./LyricsDiv";
import LyricsArray from "./LyricsArray";
import HandleMouseEvent from "./HandleMouseEvent";
import { LYRICS_FORMAT, SECOND_LEN_PX } from "./globals";

// temp global variable
const tempTimelineLength = SECOND_LEN_PX * 120;

const LYRICS_ARRAY = new LyricsArray(tempTimelineLength);
const HANDLE_MOUSE_EVENT = new HandleMouseEvent();

const addLyricsBtn = document.querySelector("#add-lyrics");
addLyricsBtn.addEventListener("click", addLyricsDiv);

const timelineWrapper = document.querySelector("#timeline-wrapper");
const timeline = document.querySelector("#timeline");
const markContainer = document.querySelector("#mark-container");
const lyricsContainer = document.querySelector("#lyrics-container");

document.addEventListener("mousedown", (e) => {
  // 클릭한 부분이 가사 div인지 확인
  const isLyricsClicked = e.target.closest(".lyrics") ? true : false;
  if (isLyricsClicked) {
    HANDLE_MOUSE_EVENT.enableHighlight(e, LYRICS_ARRAY);
  } else {
    HANDLE_MOUSE_EVENT.disableHighlight(e, LYRICS_ARRAY);
  }
});

document.addEventListener("mousemove", (e) => {
  const isLyricsSelected = LYRICS_ARRAY.selected instanceof LyricsDiv;
  const isDragging =
    !HANDLE_MOUSE_EVENT.isSizeChanging && HANDLE_MOUSE_EVENT.isMouseDown;
  const isSizeChanging = HANDLE_MOUSE_EVENT.isSizeChanging;

  if (isLyricsSelected && isDragging) {
    // 가사가 선택됐고 크기조절중이 아닐때
    HANDLE_MOUSE_EVENT.moveLyrics(e, LYRICS_ARRAY, timelineWrapper);
  } else if (isLyricsSelected && isSizeChanging) {
    // 가사가 선택됐고 크기조절중일때
    HANDLE_MOUSE_EVENT.sizeChangeLyrics(e, LYRICS_ARRAY);
  }
});

document.addEventListener("mouseup", (e) => {
  // when mouse is up, then set the time of the selected lyrics
  const isLyricsDragged = LYRICS_ARRAY.selected instanceof LyricsDiv;
  if (isLyricsDragged) {
    HANDLE_MOUSE_EVENT.fixLyricsPos();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
});

function initTimeline() {
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
  // lyricsDiv.initHighlightDiv();
}
