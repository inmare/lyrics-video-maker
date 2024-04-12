import LyricsDiv from "./LyricsDiv";

export default class HandleMouseEvent {
  // 마우스 이벤트 관련 static 변수
  static startCursorPos = null;
  static endCursorPos = null;
  static isMouseDown = false;
  static isMouseMoving = false;
  static isSizeChanging = false;
  static sizeChangeFrom = null;

  constructor() {}

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
    this.endCursorPos = lyricsArr.selected.getLength() - offsetFront;
    mouseState.isMouseDown = true;

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
}
