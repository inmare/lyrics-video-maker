export default class LyricsInfo {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.lyrics = "";
  }

  displayLyricsInfo(lyricsArr, timeEditor, lyricsEditor) {
    const lyricsObj = this._getFormattedLyrics(lyricsArr);

    timeEditor[0].value = lyricsObj.startTime.str[0];
    timeEditor[1].value = lyricsObj.startTime.str[1];
    timeEditor[2].value = lyricsObj.startTime.str[2];
    timeEditor[3].value = lyricsObj.endTime.str[0];
    timeEditor[4].value = lyricsObj.endTime.str[1];
    timeEditor[5].value = lyricsObj.endTime.str[2];
    lyricsEditor.value = lyricsObj.lyrics;
  }
  _getFormattedLyrics(lyricsArr) {
    const lyrics = lyricsArr.selected;
    const startTimeObj = lyrics.getFormattedStartTime();
    const endTimeObj = lyrics.getFormattedEndTime();
    const context = lyrics.getContext();

    return {
      startTime: startTimeObj,
      endTime: endTimeObj,
      lyrics: context,
    };
  }
}
