import { lineColor, backgroundColor, textColor } from "../helpers/colors.js";

const padding = { top: 0, right: 0, bottom: 0, left: 0 };
const lineWidth = 600;
const lineHeight = 60;
const lineGap = 24;
const gap = 4;
const fontSize = 30;
const textMargin = 40;

class OverlapChart {
  constructor(data) {
    this.data = Array.from(data.entries());
    this.canvasSize = {
      width: lineWidth,
      height: (lineHeight + lineGap) * this.data.length,
    };
  }

  draw = async (p) => {
    // Preserve context
    const self = this;

    let w = self.canvasSize.width;
    let h = self.canvasSize.height;

    // Call p5.js functions
    p.setup = () => {
      p.createCanvas(w, h);
      p.noLoop();

      console.log("OverlapChart: p5.js setup function executed!");
    };

    p.draw = () => {
      let x = 0,
        y = 0;

      p.background(backgroundColor);

      // Draw graph
      self.data.forEach(([id, circuitObj], index) => {
        console.log(id, circuitObj);

        const keys = Object.keys(circuitObj);

        const halfGap = gap / 2;
        const total = circuitObj[keys[0]] + circuitObj[keys[1]];
        const lineLengthA = lineWidth * (circuitObj[keys[0]] / total);
        const lineLengthB = lineWidth * (circuitObj[keys[1]] / total);
        const overlapLength = lineWidth * (circuitObj[keys[2]] / total);

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
        p.text(keys[1], lineWidth - textMargin, y + lineHeight / 2);

        y += lineHeight + lineGap;
      });

      console.log("OverlapChart: p5.js draw function executed!");
    };
  };
}

export default OverlapChart;
