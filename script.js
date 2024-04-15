import LyricsDiv from "./LyricsDiv";
import LyricsArray from "./LyricsArray";
import HandleMouseEvent from "./HandleMouseEvent";
import LyricsInfo from "./LyricsInfo";
import { LYRICS_FORMAT, SECOND_LEN_PX } from "./globals";
import * as PIXI from "pixi.js";

// temp global variable
const tempTimelineLength = SECOND_LEN_PX * 120;

const LYRICS_ARRAY = new LyricsArray(tempTimelineLength);

const addLyricsBtn = document.querySelector("#add-lyrics");
addLyricsBtn.addEventListener("click", addLyricsDiv);

const layerWrapper = document.querySelector("#layer-wrapper");

const timelineWrapper = document.querySelector("#timeline-wrapper");
const timeline = document.querySelector("#timeline");
const markContainer = document.querySelector("#mark-container");
const markTimeContainer = document.querySelector("#mark-time-container");
const lyricsContainer = document.querySelector("#lyrics-container");

const timeEditor = document.querySelectorAll("#lyrics-info input[type='text']");
const lyricsEditor = document.querySelector("#lyrics-editor");

const canvasContainer = document.querySelector("#canvas-container");
const app = new PIXI.Application();

document.addEventListener("mousedown", (e) => {
  // 클릭한 부분이 가사 div인지 확인
  const isLyricsClicked = e.target.closest(".lyrics") ? true : false;
  HandleMouseEvent.setMousedownState(e, LYRICS_ARRAY, isLyricsClicked);
  if (isLyricsClicked) {
    LyricsInfo.displayLyricsInfo(LYRICS_ARRAY, timeEditor, lyricsEditor);
  }
});

document.addEventListener("mousemove", (e) => {
  const isLyricsSelected = LYRICS_ARRAY.selected instanceof LyricsDiv;
  if (isLyricsSelected) {
    const scrollAmount = timelineWrapper.scrollLeft;
    const layerWidth = layerWrapper.getBoundingClientRect().width;
    HandleMouseEvent.setMousemoveState(
      e,
      LYRICS_ARRAY,
      scrollAmount,
      layerWidth,
    );
  }
});

document.addEventListener("mouseup", (e) => {
  // 마우스를 떼었을 때 기존에 클래스에 저장한 값 초기화
  const isLyricsDragged = LYRICS_ARRAY.selected instanceof LyricsDiv;
  if (isLyricsDragged) {
    LyricsInfo.displayLyricsInfo(LYRICS_ARRAY, timeEditor, lyricsEditor);
    HandleMouseEvent.initMouseState();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
  initCanvas();
  async function initCanvas() {
    await app.init({
      background: "#000000",
      width: 320,
      height: 180,
    });
    canvasContainer.appendChild(app.canvas);
  }
});

lyricsEditor.addEventListener("focusout", (e) => {
  if (LyricsInfo.lyricsDiv instanceof LyricsDiv) {
    LyricsInfo.lyricsDiv.setContext(e.target.value);
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fill: "white",
    });
    const text = new PIXI.Text({ text: e.target.value, style });
    text.x = 0;
    text.y = 0;
    app.stage.addChild(text);
  }
});

function initTimeline() {
  timeline.style.width = `${tempTimelineLength}px`;
  const markGap = SECOND_LEN_PX;

  for (let i = 0; i < tempTimelineLength; i += markGap) {
    const mark = document.createElement("div");
    mark.classList.add("mark");
    mark.style.left = `${i}px`;
    markContainer.appendChild(mark);
  }

  const markTimeGap = SECOND_LEN_PX * 5;
  let time = 0;

  for (let i = 0; i < tempTimelineLength; i += markTimeGap) {
    if (tempTimelineLength - i < (markTimeGap / 5) * 2) break;

    const markTime = document.createElement("p");
    markTime.classList.add("mark-time");
    markTime.innerText = `${formatSecond(time)}`;
    markTime.style.left = `${i}px`;
    markTimeContainer.appendChild(markTime);

    time += 5;
  }

  function formatSecond(time) {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    const minStr = min < 10 ? `0${min}` : min.toString();
    const secStr = sec < 10 ? `0${sec}` : sec.toString();
    return `${minStr}:${secStr}`;
  }
}

function addLyricsDiv() {
  const lyricsDiv = new LyricsDiv(LYRICS_FORMAT);
  lyricsDiv.setTime(0);
  lyricsDiv.setLength(SECOND_LEN_PX * 4);
  const random = Math.round(Math.random() * 100);
  lyricsDiv.setContext("Lyrics" + random.toString().padStart(2, "0"));

  if (LYRICS_ARRAY.length > 0) {
    const lastSubtitle = LYRICS_ARRAY[LYRICS_ARRAY.length - 1];
    lyricsDiv.setTime(lastSubtitle.getTime() + lastSubtitle.getLength());
  }

  LYRICS_ARRAY.push(lyricsDiv);
  lyricsContainer.appendChild(lyricsDiv.getDiv());
}
