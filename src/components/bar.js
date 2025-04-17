import { lineColor, backgroundColor, textColor } from "../helpers/colors.js";

const padding = { top: 0, right: 0, bottom: 0, left: 0 };
const barHeight = 60;
const barGap = 4;
const fontSize = 30;
const multiplier = 1;
const textMargin = 40;

class BarChart {
  constructor(data) {
    this.containter = this.data = Array.from(data.entries());
    this.scale = 1;
    this.breakpoint = 668;

    this.setCanvasSize();
  }

  setCanvasSize = () => {
    // Handle breakpoints
    if (window.innerWidth < this.breakpoint) {
      this.scale = 0.5;
    } else {
      this.scale = 1;
    }

    // Calculate dimensions
    const maxBarWidth = Math.max(...this.data.map((d) => d[1]));
    const width = this.scale * (maxBarWidth * multiplier + padding.left + padding.right);
    const height = this.scale * (padding.top + padding.bottom + [...this.data.keys()].length * (barGap + barHeight) - barGap);

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

      console.log("BarChart: p5.js setup function executed!");
    };

    p.draw = () => {
      p.scale(self.scale);
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
