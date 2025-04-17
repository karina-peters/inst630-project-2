import { lineColor, backgroundColor, textColor } from "../helpers/colors.js";

const padding = { top: 0, right: 0, bottom: 0, left: 0 };
const multiplier = 2.5;
const angle = Math.PI / 4;
const bubbleGap = 4;

class BubbleChart {
  constructor(data) {
    this.data = Array.from(data.entries());
    this.scale = 1;
    this.breakpoint = 600;
    this.canvasSize = this.getCanvasSize();
  }

  getCanvasSize = () => {
    // TODO: actually calculate these sizes
    let width = 400;
    let height = 400;

    // Handle breakpoints
    if (window.innerWidth < this.breakpoint) {
      this.scale = 0.75;
      width = 312;
      height = 300;
    } else {
      this.scale = 1;
    }

    // Calculate dimensions
    // const width = ;
    // const height = ;

    return { width, height };
  };

  draw = async (p) => {
    // Preserve context
    const self = this;

    const w = self.canvasSize.width;
    const h = self.canvasSize.height;
    const offsetX = 200; // w / 2;
    const offsetY = 200; // h / 2;

    // Call p5.js functions
    p.setup = () => {
      p.createCanvas(w, h);
      p.noLoop();

      p.windowResized = () => {
        self.canvasSize = this.getCanvasSize();

        p.resizeCanvas(self.canvasSize.width, self.canvasSize.height);
        p.redraw();
      };

      console.log("BubbleChart: p5.js setup function executed!");
    };

    p.draw = () => {
      p.scale(self.scale);
      p.background(backgroundColor);

      // Draw graph
      let r0 = 0;
      let rCurr = 0;
      let rPrev = 0;
      let posX, posY;

      self.data.map(([lineCode, stnCount], index) => {
        // Create Circles
        rPrev = rCurr;
        rCurr = stnCount * multiplier;
        let coords = {};
        if (index === 0) {
          r0 = stnCount * multiplier;
          posX = offsetX;
          posY = offsetY;
        } else if (index === 1) {
          coords = this.getTangentCirclePos(offsetX, offsetY, r0, rCurr, angle);
          posX = coords.x;
          posY = coords.y;
        } else {
          coords = this.getBitangentCirclePos(offsetX, offsetY, r0, posX, posY, rPrev, rCurr);
          posX = coords.x;
          posY = coords.y;
        }

        p.noStroke();
        p.fill(lineColor[lineCode]);
        p.ellipseMode(p.RADIUS);
        p.ellipse(posX, posY, rCurr, rCurr);

        // Create Text
        p.fill(textColor.dark);
        p.textSize(rCurr / 2);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(stnCount, posX, posY);
      });

      console.log("BubbleChart: p5.js draw function executed!");
    };
  };

  getTangentCirclePos = (x0, y0, r0, r1, angle) => {
    // Distance between centers equals the sum of radii
    const dist = r0 + r1 + bubbleGap;

    // Calculate the center of c1
    const x = x0 + dist * Math.cos(angle);
    const y = y0 + dist * Math.sin(angle);

    return { x, y };
  };

  getBitangentCirclePos = (x0, y0, r0, x1, y1, r1, r2) => {
    // Distance between centers of c0 and c2, c1 and c2
    const dist0 = r0 + r2 + bubbleGap;
    const dist1 = r1 + r2 + bubbleGap;

    // Distance between the centers of c0 and c1
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    // Using the law of cosines to find the c2 angle
    const cosAngle = (Math.pow(dist0, 2) + Math.pow(d, 2) - Math.pow(dist1, 2)) / (2 * dist0 * d);
    const angle = Math.acos(cosAngle);

    // Direction vector from c0 to c1, normalized
    const nx = dx / d;
    const ny = dy / d;

    // Clockwise solution
    const x = x0 + dist0 * (nx * Math.cos(angle) - ny * Math.sin(angle));
    const y = y0 + dist0 * (nx * Math.sin(angle) + ny * Math.cos(angle));
    return { x, y };
  };
}

export default BubbleChart;
