export default class LyricsArray extends Array {
  constructor(timelineLength) {
    super();
    this.selected = null;
    this.timelineLength = timelineLength;
  }
}
