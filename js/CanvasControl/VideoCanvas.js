import Playbar from "../ProjectControl/Playbar";
import VideoProject from "../ProjectControl/VideoProject";
import { VIDEO_FRAME, PREVIEW_SIZE } from "../Misc/globals";
import * as PIXI from "pixi.js";

export default class VideoCanvas {
  static app;
  static ticker;
  static startTime;
  static isPlaying = false;
  static elapsedTime = 0;
  static lyricsFont;

  constructor() {}

  static async init(canvasContainer) {
    this.app = new PIXI.Application();
    await this.app.init({
      background: "#000000",
      width: PREVIEW_SIZE[0],
      height: PREVIEW_SIZE[1],
    });

    this.lyricsFont = await PIXI.Assets.load(
      "../../assets/PretendardJP-SemiBold.woff2",
    );
    canvasContainer.appendChild(this.app.canvas);

    const text = new PIXI.Text({
      text: "Hello, World!",
      style: {
        fontFamily: "PretendardJP-SemiBold",
        fontSize: 24,
        fill: 0xffffff,
      },
    });
    text.x = 0;
    text.y = 0;
    this.app.stage.addChild(text);

    this.ticker = new PIXI.Ticker();
    this.ticker.autostart = false;
    this.ticker.add(() => {
      this.updateComponent();
    });
  }

  static startUpdate() {
    this.isPlaying = true;
    this.startTime = performance.now();
    this.ticker.start();
  }

  static stopUpdate() {
    this.ticker.stop();
    this.isPlaying = false;
  }

  static updateComponent() {
    if (this.elapsedTime <= VideoProject.length * 1000) {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.startTime;
      if (deltaTime + this.elapsedTime > VideoProject.length * 1000) {
        this.elapsedTime = VideoProject.length * 1000;
        return;
      }
      const frameTime = 1000 / VIDEO_FRAME;
      const text = this.app.stage.children[0];
      if (deltaTime > frameTime) {
        this.startTime = currentTime;
        this.elapsedTime += deltaTime;
        Playbar.movePlaybar();
        text.text = (this.elapsedTime / 1000).toFixed(1);
      }
    }
  }
}
