export default class LyricsArray {
  static _lyricsArr = [];
  static selected = null;

  constructor() {}

  static push(lyrics) {
    this._lyricsArr.push(lyrics);
  }

  static find(callback) {
    return this._lyricsArr.find(callback);
  }

  static indexOf(lyrics) {
    return this._lyricsArr.indexOf(lyrics);
  }

  static getLyrics(idx) {
    return this._lyricsArr[idx];
  }

  static getLength() {
    return this._lyricsArr.length;
  }
}
