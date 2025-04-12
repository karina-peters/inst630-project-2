import { lineColor, backgroundColor, textColor } from "../helpers/colors.js";

const padding = { top: 0, right: 0, bottom: 0, left: 0 };
const barHeight = 60;
const barGap = 4;
const fontSize = 30;
const multiplier = 1;
const textMargin = 40;

class BarChart {
  constructor(data) {
    this.data = Array.from(data.entries());
    this.canvasSize = {
      width: Math.max(...data.values()) * multiplier + padding.left + padding.right,
      height: padding.top + padding.bottom + [...data.keys()].length * (barGap + barHeight) - barGap,
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

      console.log("BarChart: p5.js setup function executed!");
    };

    p.draw = () => {
      p.background(backgroundColor);
      // Draw graph
      self.data.map(([lineCode, trackLength], index) => {
        // Create bars
        let posX = trackLength * multiplier;
        let posY = padding.top + barHeight / 2 + index * (barGap + barHeight);
        p.stroke(lineColor[lineCode]);
        p.strokeWeight(barHeight);
        p.strokeCap(p.SQUARE);
        p.line(padding.left, posY, padding.left + posX, posY);

        // Create text
        p.noStroke();
        p.fill(textColor.dark);
        p.textSize(fontSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(lineCode, posX - textMargin, posY);
      });

      console.log("BarChart: p5.js draw function executed!");
    };
  };
}

export default BarChart;
