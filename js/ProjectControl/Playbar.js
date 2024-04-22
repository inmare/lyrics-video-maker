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
    this.playbar.style.left = "-1px";
  }

  static movePlaybar() {
    this.currentTime = VideoCanvas.currentTime / 1000;
    const currentPx = Math.round(this.currentTime * SECOND_LEN_PX);
    this.playbar.style.left = `${currentPx - 1}px`;
  }

  static setPlaybarPos(e, scrollAmount, layerWidth) {
    const mouseX = e.clientX;
    const clickedPos = mouseX + scrollAmount - layerWidth;
    const clickedTime = px2time(clickedPos);
    this.playbar.style.left = `${clickedPos - 1}px`;
    this.playbar.currentTime = clickedTime;
    VideoCanvas.currentTime = clickedTime * 1000;
    VideoCanvas.app.ticker.update();
  }
}
