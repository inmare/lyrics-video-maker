import LyricsArray from "./LyricsArray";
import { time2str } from "../Misc/utils";

export default class LyricsInfo {
  static lyrics;

  constructor() {}

  static displayLyricsInfo(timeEditor, lyricsEditor) {
    this.lyrics = LyricsArray.selected;
    const startTimeArray = time2str(this.lyrics.getStartTime());
    const endTimeArray = time2str(this.lyrics.getEndTime());
    const context = this.lyrics.getContext();

    timeEditor[0].value = startTimeArray[0]; // min
    timeEditor[1].value = startTimeArray[1]; // sec
    timeEditor[2].value = startTimeArray[2]; // msec
    timeEditor[3].value = endTimeArray[0]; // min
    timeEditor[4].value = endTimeArray[1]; // sec
    timeEditor[5].value = endTimeArray[2]; // msec
    lyricsEditor.value = context;
  }
}
