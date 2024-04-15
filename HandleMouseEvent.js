import Lyrics from "./Lyrics";

export default class HandleMouseEvent {
  // 마우스 이벤트 관련 static 변수
  static divInfo = {
    leftFromCursor: null, // div의 시작지점에서 마우스의 위치, Number
    rightFromCursor: null, // div의 끝지점에서 마우스의 위치, Number
    mouseDownPos: null, // 마우스를 누르기 시작한 위치, Number
    originalLength: null, // div의 원래 길이, Number
  };

  static isMouseDown = false; // 마우스를 누르고 있는 상태인지
  static isMouseMoving = false; // 마우스를 움직이고 있는 상태인지
  static isSizeChanging = false; // 크기 조절 중인 상태인지
  static sizeChangeFrom = null; // 어디에서 크기조절을 시작했는지, "left" or "right"

  constructor() {}

  static _saveMouseInfo(e, lyricsArr) {
    // 마우스의 위치 및 현재 마우스를 누르고 있는 상태를 저장
    this.divInfo.leftFromCursor =
      e.clientX - lyricsArr.selected.getDivStartPos();
    this.divInfo.rightFromCursor =
      lyricsArr.selected.getLength() - this.divInfo.leftFromCursor;
    this.divInfo.originalLength = lyricsArr.selected.getLength();
    this.divInfo.mouseDownPos = e.clientX;
  }

  // 선택한 div highlight 추가
  static setMousedownState(e, lyricsArr, isLyricsClicked) {
    this.isMouseDown = true;

    if (isLyricsClicked) {
      let lyricsDiv = e.target.closest(".lyrics");

      // 현재 선택된 가사의 여부에 따라 lyricsArr.selected를 설정
      if (lyricsArr.selected instanceof Lyrics) {
        lyricsArr.selected.disableHighlight();
      }
      lyricsArr.selected = lyricsArr.find(
        (lyrics) => lyrics.getDiv() === lyricsDiv,
      );

      this._enableHighlight(lyricsArr);
      this._setSizeChangeFrom(e);
      this._saveMouseInfo(e, lyricsArr);
    } else {
      this._disableHighlight(lyricsArr);
    }
  }

  static _enableHighlight(lyricsArr) {
    lyricsArr.selected.enableHighlight();
  }

  // 선택된 div highlight 해제
  static _disableHighlight(lyricsArr) {
    if (lyricsArr.selected instanceof Lyrics) {
      lyricsArr.selected.disableHighlight();
      lyricsArr.selected = null;
    }
  }

  static _setSizeChangeFrom(e) {
    // 만약 크기조절 div 부분을 선택했다면 크기 조절 중인 상태로 변경
    if (e.target.classList.contains("lyrics-size-change")) {
      this.isSizeChanging = true;
      if (e.target.parentElement.firstElementChild === e.target) {
        this.sizeChangeFrom = "left";
      } else if (e.target.parentElement.lastElementChild === e.target) {
        this.sizeChangeFrom = "right";
      }
    } else {
      this.isSizeChanging = false;
    }
  }

  static setMousemoveState(e, lyricsArr, scrollAmount, layerWidth) {
    this.isMouseMoving = true;

    const isDragging = !this.isSizeChanging && this.isMouseDown;
    const isSizeChanging = this.isSizeChanging;

    if (isDragging) {
      // 가사가 선택됐고 크기조절중이 아닐때
      this._moveLyrics(e, lyricsArr, scrollAmount, layerWidth);
    } else if (isSizeChanging) {
      // 가사가 선택됐고 크기조절중일때
      this._sizeChangeLyrics(e, lyricsArr, scrollAmount, layerWidth);
    }
  }

  static _moveLyrics(e, lyricsArr, scrollAmount, layerWidth) {
    // 현재 div의 시간
    // 브라우저 마우스 위치 - div 시작점 위치 + 스크롤 된 길이
    const lyricsStartTime =
      e.clientX - this.divInfo.leftFromCursor + scrollAmount - layerWidth;
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

  static _sizeChangeLyrics(e, lyricsArr, scrollAmount, layerWidth) {
    const lyricsIdx = lyricsArr.indexOf(lyricsArr.selected);
    const nextLyrics = lyricsArr[lyricsIdx + 1];
    const prevLyrics = lyricsArr[lyricsIdx - 1];

    switch (this.sizeChangeFrom) {
      case "left":
        {
          // 왼쪽 끝에서 크기 조절
          // div의 시작점 = 마우스의 위치 - leftDivDelta - 스크롤 된 길이
          const lyricsStartTime =
            e.clientX - this.divInfo.leftFromCursor + scrollAmount - layerWidth;
          const divStartPos =
            this.divInfo.mouseDownPos -
            this.divInfo.leftFromCursor +
            scrollAmount -
            layerWidth -
            1;

          const lyricsLength =
            this.divInfo.originalLength - (lyricsStartTime - divStartPos);

          lyricsArr.selected.setTime(lyricsStartTime);
          lyricsArr.selected.setLength(lyricsLength);

          let divStartLimit;
          if (prevLyrics) {
            // div의 시작점 제한 = 이전 가사의 끝점
            divStartLimit = prevLyrics.getTime() + prevLyrics.getLength();
          } else if (!prevLyrics && lyricsIdx === 0) {
            // div의 시작점 제한 = 타임라인의 시작
            divStartLimit = 0;
          }

          if (lyricsStartTime < divStartLimit) {
            lyricsArr.selected.setTime(divStartLimit);
            lyricsArr.selected.setLength(
              this.divInfo.originalLength - (divStartLimit - divStartPos),
            );
          }
        }
        break;
      case "right":
        {
          // 오른쪽 끝에서 크기 조절
          // div의 길이 = 마우스의 위치 + rightDivDelta - div의 실제 위치 - 스크롤 된 길이
          const divStartPos =
            lyricsArr.selected.getDivStartPos() + scrollAmount - layerWidth;
          const lyricsLength =
            e.clientX +
            this.divInfo.rightFromCursor +
            scrollAmount -
            divStartPos -
            layerWidth;
          lyricsArr.selected.setLength(lyricsLength);

          // 현재 div의 끝점
          const currentDivEnd = divStartPos + lyricsLength;

          // div의 크기 제한
          let divEndLimit;
          if (nextLyrics) {
            // div의 크기제한 = 다음 가사의 시작점
            // + 1을 해야지 다음 가사의 사이에 틈이 생기지 않음
            divEndLimit = nextLyrics.getTime() + 1;
          } else if (!nextLyrics && lyricsIdx === lyricsArr.length - 1) {
            // 다음 가사가 없을 때 div의 크기제한 = 타임라인의 끝
            divEndLimit = lyricsArr.timelineLength + 1;
          }

          if (currentDivEnd > divEndLimit) {
            lyricsArr.selected.setLength(divEndLimit - divStartPos);
          }
        }
        break;
      default:
        break;
    }
  }

  static initMouseState() {
    this.divInfo.leftFromCursor = null;
    this.divInfo.rightFromCursor = null;
    this.divInfo.mouseDownPos = null;
    this.divInfo.originalLength = null;

    this.isMouseDown = false;
    this.isMouseMoving = false;
    this.isSizeChanging = false;
    this.sizeChangeFrom = null;
  }
}
