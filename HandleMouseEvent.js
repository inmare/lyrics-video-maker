import LyricsDiv from "./LyricsDiv";

export default class HandleMouseEvent {
  // 마우스 이벤트 관련 this.변수
  constructor() {
    this.startCursorPos = null; // div의 시작지점에서 마우스의 위치, Number
    this.endCursorPos = null; // div의 끝지점에서 마우스의 위치, Number
    this.isMouseDown = false; // 마우스를 누르고 있는 상태인지
    this.isMouseMoving = false; // 마우스를 움직이고 있는 상태인지
    this.isSizeChanging = false; // 크기 조절 중인 상태인지
    this.sizeChangeFrom = null; // 어디에서 크기조절을 시작했는지, "front" or "end"
  }

  // 선택한 div highlight 추가
  enableHighlight(e, lyricsArr) {
    let lyricsDiv = e.target.closest(".lyrics");

    // 현재 선택된 가사의 여부에 따라 lyricsArr.selected를 설정
    if (lyricsArr.selected === null) {
      lyricsArr.selected = lyricsArr.find(
        (lyrics) => lyrics.getDiv() === lyricsDiv,
      );
      lyricsArr.selected.enableHighlight();
    } else if (lyricsArr.selected instanceof LyricsDiv) {
      lyricsArr.selected.removeHighlight();
      lyricsArr.selected = lyricsArr.find(
        (lyrics) => lyrics.getDiv() === lyricsDiv,
      );
      lyricsArr.selected.enableHighlight();
    }

    // 마우스의 위치 및 현재 마우스를 누르고 있는 상태를 저장
    this.startCursorPos = e.clientX - lyricsArr.selected.getDivStartPos();
    this.endCursorPos = lyricsArr.selected.getLength() - this.startCursorPos;
    this.isMouseDown = true;

    // 만약 크기조절 div 부분을 선택했다면 크기 조절 중인 상태로 변경
    if (e.target.classList.contains("lyrics-size-change")) {
      this.isSizeChanging = true;
      if (e.target.parentElement.firstElementChild === e.target) {
        this.sizeChangeFrom = "front";
      } else if (e.target.parentElement.lastElementChild === e.target) {
        this.sizeChangeFrom = "end";
      }
    }
  }

  // 선택된 div highlight 해제
  disableHighlight(lyricsArr) {
    if (lyricsArr.selected instanceof LyricsDiv) {
      lyricsArr.selected.removeHighlight();
      lyricsArr.selected = null;
    }
  }

  mousemove(e, lyricsArr) {
    if (lyricsArr.selected instanceof LyricsDiv) {
      if (isMouseDown) {
        if (!isSizeChanging) {
          const scroll = timelineWrapper.scrollLeft;
          const time = e.clientX - offsetFront + scroll;
          lyricsArr.selected.setTime(time);
          isMouseMoving = true;

          const nextLyrics =
            lyricsArr[lyricsArr.indexOf(lyricsArr.selected) + 1];

          if (nextLyrics) {
            // -1을 하지 않으면 다음 div의 시작점이 겹칠 수 있음
            const divXLimit = nextLyrics.getDivStartPos() - 1;
            const currentDivEnd = time + lyricsArr.selected.getLength();
            if (currentDivEnd > divXLimit) {
              lyricsArr.selected.setTime(
                divXLimit - lyricsArr.selected.getLength(),
              );
            }
          } else if (
            !nextLyrics &&
            lyricsArr.indexOf(lyricsArr.selected) === lyricsArr.length - 1
          ) {
            const divXLimit = tempTimelineLength - 1;
            const currentDivEnd = time + lyricsArr.selected.getLength();
            if (currentDivEnd > divXLimit) {
              lyricsArr.selected.setTime(
                divXLimit - lyricsArr.selected.getLength(),
              );
            }
          }

          const prevLyrics =
            lyricsArr[lyricsArr.indexOf(lyricsArr.selected) - 1];

          if (prevLyrics) {
            const divXLimit =
              prevLyrics.getDivStartPos() + prevLyrics.getLength() - 1;
            if (time < divXLimit) {
              lyricsArr.selected.setTime(divXLimit);
            }
          } else if (
            !prevLyrics &&
            lyricsArr.indexOf(lyricsArr.selected) === 0
          ) {
            const devXLimit = 0;
            if (time < devXLimit) {
              lyricsArr.selected.setTime(devXLimit);
            }
          }
        } else if (isSizeChanging) {
          const scroll = timelineWrapper.scrollLeft;
          const time = e.clientX - offsetFront + scroll;
          const shiftX = e.clientX - lyricsArr.selected.getDivStartPos();
          const length = shiftX + offsetEnd;

          // check the e.target is the last child of parent element
          if (sizeChangePos === "front") {
            // 나중에 다시 작성
            // const prevLyrics =
            //   lyricsArr[lyricsArr.indexOf(lyricsArr.selected) - 1];
            // if (prevLyrics) {
            //   const divXLimit =
            //     prevLyrics.getDivStartPos() + prevLyrics.getLength() - 1;
            //   if (time < divXLimit) {
            //     lyricsArr.selected.setTime(divXLimit);
            //   } else {
            //     lyricsArr.selected.setTime(time);
            //     lyricsArr.selected.setLength(length);
            //   }
            // } else if (
            //   !prevLyrics &&
            //   lyricsArr.indexOf(lyricsArr.selected) === 0
            // ) {
            //   const devXLimit = 0;
            //   if (time < devXLimit) {
            //     lyricsArr.selected.setTime(devXLimit);
            //   }
            // }
          } else if (sizeChangePos === "end") {
            const nextLyrics =
              lyricsArr[lyricsArr.indexOf(lyricsArr.selected) + 1];

            if (nextLyrics) {
              const divXLimit = nextLyrics.getDivStartPos() - 1;
              const currentDivEnd =
                lyricsArr.selected.getDivStartPos() + length;
              // console.log(divXLimit, currentDivEnd);
              if (currentDivEnd > divXLimit) {
                lyricsArr.selected.setLength(
                  nextLyrics.getDivStartPos() -
                    lyricsArr.selected.getDivStartPos(),
                );
              } else {
                lyricsArr.selected.setLength(length);
              }
            } else if (
              !nextLyrics &&
              lyricsArr.indexOf(lyricsArr.selected) === lyricsArr.length - 1
            ) {
              const divXLimit = tempTimelineLength - 1;
              const currentDivEnd = time + lyricsArr.selected.getLength();
              if (currentDivEnd > divXLimit) {
                lyricsArr.selected.setLength(
                  divXLimit - lyricsArr.selected.getTime(),
                );
              } else {
                lyricsArr.selected.setLength(length);
              }
            }
          }
        }
      }
    }
  }

  moveLyrics(e, lyricsArr, timelineWrapper) {
    this.isMouseMoving = true;

    // 현재 div의 시간
    // 브라우저 마우스 위치 - div 시작점 위치 + 스크롤 된 길이
    const scroll = timelineWrapper.scrollLeft;
    const lyricsStartTime = e.clientX - this.startCursorPos + scroll;
    lyricsArr.selected.setTime(lyricsStartTime);

    const lyricsIdx = lyricsArr.indexOf(lyricsArr.selected);
    const nextLyrics = lyricsArr[lyricsIdx + 1];
    const prevLyrics = lyricsArr[lyricsIdx - 1];
    const currentDivEnd = lyricsStartTime + lyricsArr.selected.getLength();
    const currentDivStart = lyricsStartTime;

    let divEndLimit;
    let divStartLimit;

    // 이전 가사와 이후 가사의 존재 여부에 따라 div의 시작점과 끝점을 제한
    if (nextLyrics) {
      divEndLimit = nextLyrics.getTime();
    } else if (!nextLyrics && lyricsIdx === lyricsArr.length - 1) {
      divEndLimit = lyricsArr.timelineLength - 1;
    }

    if (prevLyrics) {
      divStartLimit = prevLyrics.getTime() + prevLyrics.getLength();
    } else if (!prevLyrics && lyricsIdx === 0) {
      divStartLimit = 0;
    }

    // div의 위치 제한
    if (currentDivEnd > divEndLimit) {
      lyricsArr.selected.setTime(divEndLimit - lyricsArr.selected.getLength());
    } else if (currentDivStart < divStartLimit) {
      lyricsArr.selected.setTime(divStartLimit);
    }
  }

  fixLyricsPos() {
    this.startCursorPos = null;
    this.endCursorPos = null;
    this.isMouseDown = false;
    this.isMouseMoving = false;
    this.isSizeChanging = false;
  }
}
