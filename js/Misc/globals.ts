type TimeFormat = {
  sec: number;
  frame: number;
};

type LyricsFromat = {
  startTime: TimeFormat;
  duration: TimeFormat;
  context: string;
};

const SECOND_LEN_PX = 30;
const VIDEO_FRAME = 30;
const PREVIEW_SIZE = [640, 360];

export { TimeFormat, LyricsFromat, SECOND_LEN_PX, VIDEO_FRAME, PREVIEW_SIZE };
