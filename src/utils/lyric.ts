const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

export default class Lyric {
  private lrc: string;
  public lines: any[];

  constructor(lrc: string) {
    this.lrc = lrc;
    this.lines = [];
    this._init();
  }

  _init() {
    this._initLines();
  }

  _initLines() {
    const lines = this.lrc.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result: any = timeExp.exec(line);
      if (result) {
        const txt = line.replace(timeExp, "").trim();
        let time = 0;
        if (txt) {
          if (result[3]) {
            result[3] = result[3].length >= 3 ? result[3] / 10 : result[3];
            time = result[1] * 60 * 1000 + result[2] * 1000 + result[3] * 10;
          } else {
            time = result[1] * 60 * 1000 + result[2] * 1000;
          }
          this.lines.push({
            time,
            txt,
          });
        }
      }
    }
    this.lines.sort((a, b) => {
      return a.time - b.time;
    });
  }
}
