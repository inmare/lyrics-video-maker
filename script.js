import LyricsDiv from "./LyricsDiv";
import LyricsArray from "./LyricsArray";
import { LYRICS_FORMAT, SECOND_LEN_PX } from "./globals";

// temp global variable
const tempTimelineLength = SECOND_LEN_PX * 120;

const LYRICS_ARRAY = new LyricsArray();

const addLyricsBtn = document.querySelector("#add-lyrics");
addLyricsBtn.addEventListener("click", addLyricsDiv);

const timelineWrapper = document.querySelector("#timeline-wrapper");
const timeline = document.querySelector("#timeline");
const markContainer = document.querySelector("#mark-container");
const lyricsContainer = document.querySelector("#lyrics-container");

let offsetFront = null;
let offsetEnd = null;
let isMouseDown = false;
let isMouseMoving = false;
let isSizeChanging = false;
let sizeChangePos = null; // "front" or "end"

document.addEventListener("mousedown", (e) => {
  // check the clicked element is lyrics
  const isLyricsClicked = e.target.closest(".lyrics") ? true : false;
  if (isLyricsClicked) {
    // if lyrics div is clicked, then toggle highlight
    let lyricsDiv = e.target.closest(".lyrics");

    if (LYRICS_ARRAY.selected === null) {
      LYRICS_ARRAY.selected = LYRICS_ARRAY.find(
        (lyrics) => lyrics.getDiv() === lyricsDiv,
      );
      LYRICS_ARRAY.selected.enableHighlight();
    } else if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
      LYRICS_ARRAY.selected.removeHighlight();
      LYRICS_ARRAY.selected = LYRICS_ARRAY.find(
        (lyrics) => lyrics.getDiv() === lyricsDiv,
      );
      LYRICS_ARRAY.selected.enableHighlight();
    }

    offsetFront = e.clientX - LYRICS_ARRAY.selected.getDivStartPos();
    offsetEnd = LYRICS_ARRAY.selected.getLength() - offsetFront;
    isMouseDown = true;

    if (e.target.classList.contains("lyrics-size-change")) {
      isSizeChanging = true;
      if (e.target.parentElement.firstElementChild === e.target) {
        sizeChangePos = "front";
      } else if (e.target.parentElement.lastElementChild === e.target) {
        sizeChangePos = "end";
      }
    }
  } else {
    // if clicked other part of the screen, then remove highlight
    if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
      LYRICS_ARRAY.selected.removeHighlight();
      LYRICS_ARRAY.selected = null;
    }
  }
});

document.addEventListener("mousemove", (e) => {
  // move lyrics div when mouse is down and lyrics is selected

  if (LYRICS_ARRAY.selected instanceof LyricsDiv) {
    if (isMouseDown) {
      if (!isSizeChanging) {
        const scroll = timelineWrapper.scrollLeft;
        const time = e.clientX - offsetFront + scroll;
        LYRICS_ARRAY.selected.setTime(time);
        isMouseMoving = true;

        const nextLyrics =
          LYRICS_ARRAY[LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) + 1];

        if (nextLyrics) {
          // -1을 하지 않으면 다음 div의 시작점이 겹칠 수 있음
          const divXLimit = nextLyrics.getDivStartPos() - 1;
          const currentDivEnd = time + LYRICS_ARRAY.selected.getLength();
          if (currentDivEnd > divXLimit) {
            LYRICS_ARRAY.selected.setTime(
              divXLimit - LYRICS_ARRAY.selected.getLength(),
            );
          }
        } else if (
          !nextLyrics &&
          LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) ===
            LYRICS_ARRAY.length - 1
        ) {
          const divXLimit = tempTimelineLength - 1;
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
      } else if (isSizeChanging) {
        const scroll = timelineWrapper.scrollLeft;
        const time = e.clientX - offsetFront + scroll;
        const shiftX = e.clientX - LYRICS_ARRAY.selected.getDivStartPos();
        const length = shiftX + offsetEnd;

        // check the e.target is the last child of parent element
        if (sizeChangePos === "front") {
          // 나중에 다시 작성
          // const prevLyrics =
          //   LYRICS_ARRAY[LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) - 1];
          // if (prevLyrics) {
          //   const divXLimit =
          //     prevLyrics.getDivStartPos() + prevLyrics.getLength() - 1;
          //   if (time < divXLimit) {
          //     LYRICS_ARRAY.selected.setTime(divXLimit);
          //   } else {
          //     LYRICS_ARRAY.selected.setTime(time);
          //     LYRICS_ARRAY.selected.setLength(length);
          //   }
          // } else if (
          //   !prevLyrics &&
          //   LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) === 0
          // ) {
          //   const devXLimit = 0;
          //   if (time < devXLimit) {
          //     LYRICS_ARRAY.selected.setTime(devXLimit);
          //   }
          // }
        } else if (sizeChangePos === "end") {
          const nextLyrics =
            LYRICS_ARRAY[LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) + 1];

          if (nextLyrics) {
            const divXLimit = nextLyrics.getDivStartPos() - 1;
            const currentDivEnd =
              LYRICS_ARRAY.selected.getDivStartPos() + length;
            // console.log(divXLimit, currentDivEnd);
            if (currentDivEnd > divXLimit) {
              LYRICS_ARRAY.selected.setLength(
                nextLyrics.getDivStartPos() -
                  LYRICS_ARRAY.selected.getDivStartPos(),
              );
            } else {
              LYRICS_ARRAY.selected.setLength(length);
            }
          } else if (
            !nextLyrics &&
            LYRICS_ARRAY.indexOf(LYRICS_ARRAY.selected) ===
              LYRICS_ARRAY.length - 1
          ) {
            const divXLimit = tempTimelineLength - 1;
            const currentDivEnd = time + LYRICS_ARRAY.selected.getLength();
            if (currentDivEnd > divXLimit) {
              LYRICS_ARRAY.selected.setLength(
                divXLimit - LYRICS_ARRAY.selected.getTime(),
              );
            } else {
              LYRICS_ARRAY.selected.setLength(length);
            }
          }
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
    offsetFront = null;
    offsetEnd = null;
    isMouseDown = false;
    isMouseMoving = false;
    isSizeChanging = false;
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
