export default class LyricsInfo {
  static lyricsDiv;

  constructor() {}

  static displayLyricsInfo(lyricsArr, timeEditor, lyricsEditor) {
    this.lyricsDiv = lyricsArr.selected;
    const lyricsObj = this._getFormattedLyrics();

    timeEditor[0].value = lyricsObj.startTime.str[0]; // min
    timeEditor[1].value = lyricsObj.startTime.str[1]; // sec
    timeEditor[2].value = lyricsObj.startTime.str[2]; // msec
    timeEditor[3].value = lyricsObj.endTime.str[0]; // min
    timeEditor[4].value = lyricsObj.endTime.str[1]; // sec
    timeEditor[5].value = lyricsObj.endTime.str[2]; // msec
    lyricsEditor.value = lyricsObj.lyrics;
  }
  static _getFormattedLyrics() {
    const startTimeObj = this.lyricsDiv.getFormattedStartTime();
    const endTimeObj = this.lyricsDiv.getFormattedEndTime();
    const context = this.lyricsDiv.getContext();

    return {
      startTime: startTimeObj,
      endTime: endTimeObj,
      lyrics: context,
    };
  }
}
