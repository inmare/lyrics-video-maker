import Playbar from "../ProjectControl/Playbar";
import { VIDEO_FRAME } from "../Misc/globals";
import * as PIXI from "pixi.js";

export default class VideoCanvas {
  static app;
  static ticker;
  static startTime;
  static isPlaying = false;
  static elapsedTime = 0;

  constructor() {}

  static async init(canvasContainer) {
    this.app = new PIXI.Application();
    await this.app.init({
      background: "#000000",
      width: 320,
      height: 180,
    });
    canvasContainer.appendChild(this.app.canvas);

    this.ticker = new PIXI.Ticker();
    this.ticker.autostart = false;
    this.ticker.add(() => {
      this.updateComponent();
    });
  }

  static startUpdate() {
    this.startTime = performance.now();
    this.ticker.start();
  }

  static stopUpdate() {
    this.ticker.stop();
    VideoCanvas.isPlaying = false;
    VideoCanvas.elapsedTime = 0;
    Playbar.stopPlaybar();
  }

  static updateComponent() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.startTime;
    const frameTime = 1000 / VIDEO_FRAME;
    if (deltaTime > frameTime) {
      this.startTime = currentTime;
      this.elapsedTime += deltaTime;
      Playbar.movePlaybar();
    }
  }
}
