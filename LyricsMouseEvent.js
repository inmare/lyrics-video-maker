import Lyrics from "./Lyrics";
import LyricsArray from "./LyricsArray";
import LyricsMouseEvent from "./LyricsMouseEvent";
import LyricsInfo from "./LyricsInfo";
import Project from "./Project";
import { time2px } from "./utils";
import { LYRICS_FORMAT, SECOND_LEN_PX } from "./globals";
import * as PIXI from "pixi.js";

// temp global variable
const tempTimeLineSec = 120;
const tempTimelineLength = SECOND_LEN_PX * tempTimeLineSec;
Project.length = tempTimeLineSec;

const addLyricsBtn = document.querySelector("#add-lyrics");
addLyricsBtn.addEventListener("click", addLyricsDiv);

const layerWrapper = document.querySelector("#layer-wrapper");

const timelineWrapper = document.querySelector("#timeline-wrapper");
const timeline = document.querySelector("#timeline");
const markContainer = document.querySelector("#mark-container");
const markTimeContainer = document.querySelector("#mark-time-container");
const lyricsContainer = document.querySelector("#lyrics-container");
const playbar = document.querySelector("#playbar");

const timeEditor = document.querySelectorAll("#lyrics-info input[type='text']");
const lyricsEditor = document.querySelector("#lyrics-editor");

const canvasContainer = document.querySelector("#canvas-container");
const app = new PIXI.Application();
const container = new PIXI.Container();
const ticker = new PIXI.Ticker();

const style = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "white",
});
const text = new PIXI.Text({ text: "", style });
text.x = 0;
text.y = 0;
// container.removeChildren(0);
container.addChild(text);

let firstTime = null;
let lastTime = null;
const frame30 = 1000 / 30;
let lyricsIdx = 0;
let l = null;

ticker.autoStart = false;
ticker.add(() => {
  // console.log(ticker.deltaMS);
  if (lastTime === null) {
    firstTime = Date.now();
    lastTime = Date.now();
  } else {
    const deltaTime = Date.now() - lastTime;
    if (deltaTime > frame30) {
      lastTime = Date.now();
      const deltaTime = lastTime - firstTime;
      const min = Math.floor(deltaTime / 60000);
      const sec = Math.floor((deltaTime % 60000) / 1000);
      const msec = deltaTime % 1000;
      const timeSecond = min * 60 + sec + msec / 1000;
      playbar.style.left = `${time2px(timeSecond)}px`;

      l = LyricsArray.getLyrics(lyricsIdx);
      if (l) {
        const lStartTime = l.getStartTime();
        const lEndTime = l.getEndTime();
        if (lStartTime <= timeSecond && timeSecond <= lEndTime) {
        } else if (lStartTime < timeSecond || timeSecond > lEndTime) {
          lyricsIdx++;
        }
        l = LyricsArray.getLyrics(lyricsIdx);
        if (timeSecond < lStartTime || timeSecond > lEndTime) {
          text.text = "";
        } else {
          text.text = l.getContext();
        }
      }
    }
  }
});

const playVideoBtn = document.querySelector("#play-video");
let play = false;

document.addEventListener("mousedown", (e) => {
  // 클릭한 부분이 가사 div인지 확인
  const isLyricsClicked = e.target.closest(".lyrics") ? true : false;
  LyricsMouseEvent.setMousedownState(e, isLyricsClicked);
  if (isLyricsClicked) {
    LyricsInfo.displayLyricsInfo(timeEditor, lyricsEditor);
  }
});

document.addEventListener("mousemove", (e) => {
  const isLyricsSelected = LyricsArray.selected instanceof Lyrics;
  if (isLyricsSelected) {
    const scrollAmount = timelineWrapper.scrollLeft;
    const layerWidth = layerWrapper.getBoundingClientRect().width;
    LyricsMouseEvent.setMousemoveState(e, scrollAmount, layerWidth);
  }
});

document.addEventListener("mouseup", (e) => {
  // 마우스를 떼었을 때 기존에 클래스에 저장한 값 초기화
  const isLyricsDragged = LyricsArray.selected instanceof Lyrics;
  if (isLyricsDragged) {
    LyricsInfo.displayLyricsInfo(timeEditor, lyricsEditor);
    LyricsMouseEvent.initMouseState();
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
    app.stage.addChild(container);
  }
});

lyricsEditor.addEventListener("focusout", (e) => {
  if (LyricsInfo.lyrics instanceof Lyrics) {
    LyricsInfo.lyrics.setContext(e.target.value);
  }
});

playVideoBtn.addEventListener("click", (e) => {
  play = !play;
  if (play) {
    ticker.start();
    e.target.innerText = "영상 정지";
  } else {
    ticker.stop();
    e.target.innerText = "영상 재생";
    playbar.style.left = null;
    firstTime = null;
    lastTime = null;
    lyricsIdx = 0;
    l = null;
  }
});

function initTimeline() {
  timeline.style.width = `${time2px(Project.length)}px`;
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
  const lyricsDiv = new Lyrics(LYRICS_FORMAT);
  lyricsDiv.setStartTime(0);
  lyricsDiv.setDuration(4);
  const random = Math.round(Math.random() * 100);
  lyricsDiv.setContext("Lyrics" + random.toString().padStart(2, "0"));

  if (LyricsArray.getLength() > 0) {
    const lastSubtitle = LyricsArray.getLyrics(LyricsArray.getLength() - 1);
    lyricsDiv.setStartTimePx(
      lastSubtitle.getStartTimePx() + lastSubtitle.getDurationPx(),
    );
  }

  LyricsArray.push(lyricsDiv);
  lyricsContainer.appendChild(lyricsDiv.getDiv());
}
