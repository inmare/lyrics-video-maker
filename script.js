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
  HANDLE_MOUSE_EVENT.setMousedownState(e, LYRICS_ARRAY, isLyricsClicked);
});

document.addEventListener("mousemove", (e) => {
  const isLyricsSelected = LYRICS_ARRAY.selected instanceof LyricsDiv;
  if (isLyricsSelected) {
    const scrollAmount = timelineWrapper.scrollLeft;
    HANDLE_MOUSE_EVENT.setMousemoveState(e, LYRICS_ARRAY, scrollAmount);
  }
});

document.addEventListener("mouseup", (e) => {
  // 마우스를 떼었을 때 기존에 클래스에 저장한 값 초기화
  const isLyricsDragged = LYRICS_ARRAY.selected instanceof LyricsDiv;
  if (isLyricsDragged) {
    HANDLE_MOUSE_EVENT.initMouseState();
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
