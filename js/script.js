import Lyrics from "./LyricsControl/Lyrics";
import LyricsArray from "./LyricsControl/LyricsArray";
import LyricsMouseEvent from "./LyricsControl/LyricsMouseEvent";
import LyricsInfo from "./LyricsControl/LyricsInfo";
import VideoProject from "./ProjectControl/VideoProject";
import VideoCanvas from "./CanvasControl/VideoCanvas";
import { time2px } from "./Misc/utils";
import { LYRICS_FORMAT, SECOND_LEN_PX } from "./Misc/globals";
import Playbar from "./ProjectControl/Playbar";

// temp global variable
const tempTimeLineSec = 5;
const tempTimelineLength = SECOND_LEN_PX * tempTimeLineSec;
VideoProject.length = tempTimeLineSec;

const addLyricsBtn = document.querySelector("#add-lyrics");
addLyricsBtn.addEventListener("click", addLyricsDiv);

const playVideoBtn = document.querySelector("#play-video");

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
  VideoCanvas.init(canvasContainer);
  Playbar.init(playbar);
});

lyricsEditor.addEventListener("focusout", (e) => {
  if (LyricsInfo.lyrics instanceof Lyrics) {
    LyricsInfo.lyrics.setContext(e.target.value);
  }
});

playVideoBtn.addEventListener("click", (e) => {
  if (!VideoCanvas.isPlaying) {
    VideoCanvas.isPlaying = true;
    VideoCanvas.startUpdate();
    e.target.innerText = "영상 정지";
  } else {
    VideoCanvas.isPlaying = false;
    VideoCanvas.stopUpdate();
    e.target.innerText = "영상 재생";
  }
});

timelineWrapper.addEventListener("click", (e) => {
  const scrollAmount = timelineWrapper.scrollLeft;
  const layerWidth = layerWrapper.getBoundingClientRect().width;
  Playbar.setPlaybarPos(e, scrollAmount, layerWidth);
});

function initTimeline() {
  timeline.style.width = `${time2px(VideoProject.length)}px`;
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
