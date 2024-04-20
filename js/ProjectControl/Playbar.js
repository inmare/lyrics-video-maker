import VideoCanvas from "../CanvasControl/VideoCanvas";
import VideoProject from "./VideoProject";
import { SECOND_LEN_PX } from "../Misc/globals";
import { time2px, px2time } from "../Misc/utils";

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

  static setPlaybarPos(e, scrollAmount, layerWidth) {
    const mouseX = e.clientX;
    const clickedPos = mouseX + scrollAmount - layerWidth;
    const clickedTime = px2time(clickedPos);
    this.playbar.style.left = `${clickedPos}px`;
    this.playbar.currentTime = clickedTime;
    VideoCanvas.elapsedTime = clickedTime * 1000;
    VideoCanvas.ticker.update();
  }
}
