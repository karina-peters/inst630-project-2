import { lineColor, backgroundColor, textColor } from "../helpers/colors.js";

const padding = { top: 0, right: 0, bottom: 0, left: 0 };
const lineHeight = 60;
const linePaddingY = 8;
const badgeGap = 4;
const lineGap = 8;
const gutter = 24;

class PictoChart {
  constructor(data) {
    this.data = Array.from(data.entries()).sort(([stnA, linesA], [stnB, linesB]) => linesB.length - linesA.length);
    this.scale = 1;
    this.breakpoint = 668;
  }

  setCanvasSize = (textWidth, badgeWidth) => {
    // Handle breakpoints
    if (window.innerWidth < this.breakpoint) {
      this.scale = 0.55;
    } else {
      this.scale = 1;
    }

    // Calculate dimensions
    const badgeColWidth = this.data[0][1].length * (badgeWidth + badgeGap) - badgeGap;
    const width = this.scale * (textWidth + gutter + badgeColWidth);
    const height = this.scale * (padding.top + padding.bottom + [...this.data.keys()].length * (lineGap + lineHeight) - lineGap);

    this.canvasSize = { width, height };
  };

  draw = async (p) => {
    // Preserve context
    const self = this;

    const stnNames = self.data.map(([stnName, lines]) => stnName);
    const fontSize = (lineHeight - linePaddingY) / 2;
    const badgeWidth = lineHeight - linePaddingY;

    let textColWidth;

    // Call p5.js functions
    p.setup = () => {
      p.textSize(fontSize);

      // Get longest station name to calculate canvas size
      const longestName = stnNames.reduce((currMax, name) => (name.length > currMax.length ? name : currMax), "");
      textColWidth = p.textWidth(longestName);
      self.setCanvasSize(textColWidth, badgeWidth);

      p.createCanvas(self.canvasSize.width, self.canvasSize.height);
      p.noLoop();

      p.windowResized = () => {
        self.setCanvasSize(p.textWidth(longestName), badgeWidth);

        p.resizeCanvas(self.canvasSize.width, self.canvasSize.height);
        p.redraw();
      };

      console.log("PictoChart: p5.js setup function executed!");
    };

    p.draw = () => {
      p.scale(self.scale);
      p.background(backgroundColor);

      // Draw graph
      self.data.map(([stnName, lineCodes], index) => {
        let posX = textColWidth;
        let posY = padding.top + lineHeight / 2 + index * (lineGap + lineHeight);

        // Draw text
        p.noStroke();
        p.fill(textColor.light);
        p.textSize(fontSize);
        p.textAlign(p.RIGHT, p.CENTER);
        p.text(stnName, posX, posY);

        let badgeStartX = posX + gutter + badgeWidth / 2;

        lineCodes.forEach((code) => {
          // Draw line badges
          p.fill(lineColor[code]);
          p.circle(badgeStartX, posY, badgeWidth);

          // Draw label text
          p.noStroke();
          p.fill(textColor.dark);
          p.textSize(fontSize);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(code, badgeStartX, posY);
          badgeStartX += badgeWidth + badgeGap;
        });
      });

      console.log("PictoChart: p5.js draw function executed!");
    };
  };
}

export default PictoChart;
