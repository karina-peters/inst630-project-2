import { lineColor, backgroundColor, textColor } from "../helpers/colors.js";

const padding = { top: 0, right: 0, bottom: 0, left: 0 };
// const lineWidth = 600;
const lineHeight = 60;
const lineGap = 24;
const gap = 4;
const fontSize = 30;
const textMargin = 40;

class OverlapChart {
  constructor(data) {
    this.data = Array.from(data.entries()).sort(([lineA, cktsA], [lineB, cktsB]) => cktsB.overlap - cktsA.overlap);
    this.multiplier = 0.75;
    this.scale = 1;
    this.breakpoint1 = 800;
    this.breakpoint2 = 668;

    this.setCanvasSize();
  }

  setCanvasSize = () => {
    // Handle breakpoints
    if (window.innerWidth < this.breakpoint2) {
      this.multiplier = 0.65;
      this.scale = 0.5;
    } else if (window.innerWidth < this.breakpoint1) {
      this.scale = 0.8;
    } else {
      this.scale = 1;
    }

    // Calculate dimensions
    const width =
      this.scale *
      this.multiplier *
      this.data.reduce((maxWidth, [line, ckts]) => {
        const keys = Object.keys(ckts);
        return Math.max(maxWidth, ckts[keys[0]] + ckts[keys[1]]);
      }, 0);

    const height = this.scale * (lineHeight + lineGap) * this.data.length;

    this.canvasSize = { width, height };
  };

  draw = async (p) => {
    // Preserve context
    const self = this;

    // Call p5.js functions
    p.setup = () => {
      p.createCanvas(self.canvasSize.width, self.canvasSize.height);
      p.noLoop();

      p.windowResized = () => {
        self.setCanvasSize();

        p.resizeCanvas(self.canvasSize.width, self.canvasSize.height);
        p.redraw();
      };

      console.log("OverlapChart: p5.js setup function executed!");
    };

    p.draw = () => {
      let x = 0,
        y = 0;

      p.scale(self.scale);
      p.background(backgroundColor);

      // Draw graph
      self.data.forEach(([id, circuitObj], index) => {
        console.log(id, circuitObj);

        const keys = Object.keys(circuitObj);

        const halfGap = gap / 2;
        const lineLengthA = circuitObj[keys[0]] * this.multiplier; // lineWidth * (circuitObj[keys[0]] / total);
        const lineLengthB = circuitObj[keys[1]] * this.multiplier; // lineWidth * (circuitObj[keys[1]] / total);
        const overlapLength = circuitObj[keys[2]] * this.multiplier;
        const totalLength = lineLengthA + lineLengthB;

        // Draw line 1
        p.fill(lineColor[keys[0]]);
        p.beginShape();
        p.vertex(x, y);
        p.vertex(x + lineLengthA - halfGap, y);
        p.vertex(x + lineLengthA - halfGap, y + lineHeight / 2 - halfGap);
        p.vertex(x + lineLengthA - overlapLength - halfGap, y + lineHeight / 2 - halfGap);
        p.vertex(x + lineLengthA - overlapLength - halfGap, y + lineHeight);
        p.vertex(x, y + lineHeight);
        p.endShape();

        // Draw line 1 text
        p.noStroke();
        p.fill(textColor.dark);
        p.textSize(fontSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(keys[0], x + textMargin, y + lineHeight / 2);

        // Draw line 2
        p.fill(lineColor[keys[1]]);
        p.beginShape();
        p.vertex(x + lineLengthA + halfGap, y);
        p.vertex(x + lineLengthA + lineLengthB, y);
        p.vertex(x + lineLengthA + lineLengthB, y + lineHeight);
        p.vertex(x + lineLengthA - overlapLength + halfGap, y + lineHeight);
        p.vertex(x + lineLengthA - overlapLength + halfGap, y + lineHeight / 2 + halfGap);
        p.vertex(x + lineLengthA + halfGap, y + lineHeight / 2 + halfGap);
        p.endShape();

        // Draw line 2 text
        p.noStroke();
        p.fill(textColor.dark);
        p.textSize(fontSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(keys[1], totalLength - textMargin, y + lineHeight / 2);

        y += lineHeight + lineGap;
      });

      console.log("OverlapChart: p5.js draw function executed!");
    };
  };
}

export default OverlapChart;
