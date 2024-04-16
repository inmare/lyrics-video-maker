import Lyrics from "./Lyrics";
import LyricsArray from "./LyricsArray";
import { time2px, px2time } from "./utils";

export default class LyricsMouseEvent {
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

  static _saveMouseInfo(e) {
    // 마우스의 위치 및 현재 마우스를 누르고 있는 상태를 저장
    this.divInfo.leftFromCursor =
      e.clientX - LyricsArray.selected.getDivStartPos();
    const durationPx = LyricsArray.selected.getDurationPx();
    this.divInfo.rightFromCursor = durationPx - this.divInfo.leftFromCursor;
    this.divInfo.originalLength = durationPx;
    this.divInfo.mouseDownPos = e.clientX;
  }

  // 선택한 div highlight 추가
  static setMousedownState(e, isLyricsClicked) {
    this.isMouseDown = true;

    if (isLyricsClicked) {
      let lyricsDiv = e.target.closest(".lyrics");

      // 현재 선택된 가사의 여부에 따라 lyricsArr.selected를 설정
      if (LyricsArray.selected instanceof Lyrics) {
        LyricsArray.selected.disableHighlight();
      }
      LyricsArray.selected = LyricsArray.find(
        (lyrics) => lyrics.getDiv() === lyricsDiv,
      );

      this._enableHighlight();
      this._setSizeChangeFrom(e);
      this._saveMouseInfo(e);
    } else {
      this._disableHighlight();
    }
  }

  static _enableHighlight() {
    LyricsArray.selected.enableHighlight();
  }

  // 선택된 div highlight 해제
  static _disableHighlight() {
    if (LyricsArray.selected instanceof Lyrics) {
      LyricsArray.selected.disableHighlight();
      LyricsArray.selected = null;
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

  static setMousemoveState(e, scrollAmount, layerWidth) {
    this.isMouseMoving = true;

    const isDragging = !this.isSizeChanging && this.isMouseDown;
    const isSizeChanging = this.isSizeChanging;

    if (isDragging) {
      // 가사가 선택됐고 크기조절중이 아닐때
      this._moveLyrics(e, scrollAmount, layerWidth);
    } else if (isSizeChanging) {
      // 가사가 선택됐고 크기조절중일때
      this._sizeChangeLyrics(e, scrollAmount, layerWidth);
    }
  }

  static _moveLyrics(e, scrollAmount, layerWidth) {
    // 현재 div의 시간
    // 브라우저 마우스 위치 - div 시작점 위치 + 스크롤 된 길이
    const lyricsStartTime =
      e.clientX - this.divInfo.leftFromCursor + scrollAmount - layerWidth;
    LyricsArray.selected.setStartTimePx(lyricsStartTime);

    const lyricsIdx = LyricsArray.indexOf(LyricsArray.selected);
    const nextLyrics = LyricsArray.getLyrics(lyricsIdx + 1);
    const prevLyrics = LyricsArray.getLyrics(lyricsIdx - 1);
    const currentDivEnd =
      lyricsStartTime + LyricsArray.selected.getDurationPx();
    const currentDivStart = lyricsStartTime;

    let divEndLimit;
    let divStartLimit;

    // 이전 가사와 이후 가사의 존재 여부에 따라 div의 시작점과 끝점을 제한
    if (nextLyrics) {
      divEndLimit = nextLyrics.getStartTimePx();
    } else if (!nextLyrics && lyricsIdx === LyricsArray.getLength() - 1) {
      divEndLimit = LyricsArray.timelineLength - 1;
    }

    if (prevLyrics) {
      divStartLimit = prevLyrics.getStartTimePx() + prevLyrics.getDurationPx();
    } else if (!prevLyrics && lyricsIdx === 0) {
      divStartLimit = 0;
    }

    // div의 위치 제한
    if (currentDivEnd > divEndLimit) {
      LyricsArray.selected.setStartTimePx(
        divEndLimit - LyricsArray.selected.getDurationPx(),
      );
    } else if (currentDivStart < divStartLimit) {
      LyricsArray.selected.setStartTimePx(divStartLimit);
    }
  }

  static _sizeChangeLyrics(e, scrollAmount, layerWidth) {
    const lyricsIdx = LyricsArray.indexOf(LyricsArray.selected);
    const nextLyrics = LyricsArray.getLyrics(lyricsIdx + 1);
    const prevLyrics = LyricsArray.getLyrics(lyricsIdx - 1);

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

          LyricsArray.selected.setStartTimePx(lyricsStartTime);
          LyricsArray.selected.setDurationPx(lyricsLength);

          let divStartLimit;
          if (prevLyrics) {
            // div의 시작점 제한 = 이전 가사의 끝점
            divStartLimit =
              prevLyrics.getStartTimePx() + prevLyrics.getDurationPx();
          } else if (!prevLyrics && lyricsIdx === 0) {
            // div의 시작점 제한 = 타임라인의 시작
            divStartLimit = 0;
          }

          if (lyricsStartTime < divStartLimit) {
            LyricsArray.selected.setStartTimePx(divStartLimit);
            LyricsArray.selected.setDurationPx(
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
            LyricsArray.selected.getDivStartPos() + scrollAmount - layerWidth;
          const lyricsLength =
            e.clientX +
            this.divInfo.rightFromCursor +
            scrollAmount -
            divStartPos -
            layerWidth;
          LyricsArray.selected.setDurationPx(lyricsLength);

          // 현재 div의 끝점
          const currentDivEnd = divStartPos + lyricsLength;

          // div의 크기 제한
          let divEndLimit;
          if (nextLyrics) {
            // div의 크기제한 = 다음 가사의 시작점
            // + 1을 해야지 다음 가사의 사이에 틈이 생기지 않음
            divEndLimit = nextLyrics.getStartTimePx() + 1;
          } else if (!nextLyrics && lyricsIdx === LyricsArray.getLength() - 1) {
            // 다음 가사가 없을 때 div의 크기제한 = 타임라인의 끝
            divEndLimit = LyricsArray.timelineLength + 1;
          }

          if (currentDivEnd > divEndLimit) {
            LyricsArray.selected.setDurationPx(divEndLimit - divStartPos);
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
