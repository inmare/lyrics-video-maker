import Playbar from "../ProjectControl/Playbar";
import VideoProject from "../ProjectControl/VideoProject";
import { VIDEO_FRAME, PREVIEW_SIZE } from "../Misc/globals";
import * as PIXI from "pixi.js";

export default class VideoCanvas {
  static app;
  static isPlaying = false;
  static currentTime = 0;
  static lastUpdatedTime = null;

  constructor() {}

  static async init(canvasContainer) {
    this.app = new PIXI.Application();

    await this.app.init({
      background: "#000000",
      width: PREVIEW_SIZE[0],
      height: PREVIEW_SIZE[1],
    });

    this.app.ticker.stop();
    this.app.ticker.autoStart = false;
    this.app.ticker.add(() => {
      this.updateComponent();
    });

    canvasContainer.appendChild(this.app.canvas);

    const text = new PIXI.Text({
      text: "",
      style: {
        fontFamily: "Pretendard JP Variable",
        fontSize: 25,
        fill: 0xffffff,
        align: "center",
      },
    });
    text.x = 0;
    text.y = 0;
    this.app.stage.addChild(text);
    this.app.ticker.update();
  }

  static startUpdate() {
    this.isPlaying = true;
    this.app.ticker.start();
  }

  static stopUpdate() {
    this.app.ticker.stop();
    this.isPlaying = false;
    this.lastUpdatedTime = null;
  }

  static updateComponent() {
    if (this.isPlaying) {
      if (this.lastUpdatedTime === null) {
        this.lastUpdatedTime = performance.now();
      }
      const currentTime = performance.now();
      const elapsedTime = currentTime - this.lastUpdatedTime;
      // console.log(this.currentTime);

      if (elapsedTime >= 1000 / VIDEO_FRAME) {
        if (
          this.currentTime + 1000 / VIDEO_FRAME >=
          VideoProject.length * 1000
        ) {
          this.currentTime = VideoProject.length * 1000;
        } else {
          this.currentTime += 1000 / VIDEO_FRAME;
          this.lastUpdatedTime = currentTime;
        }
        Playbar.movePlaybar();
        this.app.stage.children[0].text = `${Math.floor(this.currentTime)}`;
      }
    } else {
      this.app.stage.children[0].text = `${Math.floor(this.currentTime)}`;
    }
  }
}
