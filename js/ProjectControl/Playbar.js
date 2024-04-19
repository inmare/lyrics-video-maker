import VideoCanvas from "../CanvasControl/VideoCanvas";
import { SECOND_LEN_PX } from "../Misc/globals";

export default class Playbar {
  static playbar;
  static currentTime = 0;

  constructor() {}

  static init(playbar) {
    this.playbar = playbar;
  }

  static movePlaybar() {
    this.currentTime = VideoCanvas.elapsedTime;
    const currentPx = Math.round((this.currentTime / 1000) * SECOND_LEN_PX);
    this.playbar.style.left = `${currentPx}px`;
  }

  static stopPlaybar() {
    this.playbar.style.left = "0px";
    this.currentTime = 0;
  }
}
