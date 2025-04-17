import { getData, getOrInitializeMapValue } from "./helpers/utils.js";
import "./styles/app.css";

import p5 from "p5";

import BarChart from "./components/bar.js";
import BubbleChart from "./components/bubble.js";
import OverlapChart from "./components/overlap.js";
import PictoChart from "./components/pictogram.js";

const main = async () => {
  // Fetch data
  const dataset = await getData("/api/routes");
  const xferStnCodes = await getData("/api/stations/transfer");

  const container = document.querySelector(".container");

  drawBar(dataset, container);
  drawBubble(dataset, container);
  drawOverlap(dataset, container);
  drawPicto(dataset, xferStnCodes, container);
};

const drawBar = (data, container) => {
  // Create wrapper element
  const vis0 = createContainer(0);
  drawVisTitle(vis0, "Track Length");
  drawVisDesc(vis0, "The relative track length");

  // Append to container
  container.appendChild(vis0);

  // Process data
  const lineToTrackLength = new Map();
  data.forEach((route) => {
    if (!lineToTrackLength.get(route.LineCode) || lineToTrackLength.get(route.LineCode) < route.TrackCircuits.length) {
      lineToTrackLength.set(route.LineCode, route.TrackCircuits.length);
    }
  });

  // Draw chart with p5.js
  const barChart = new BarChart(lineToTrackLength, vis0);
  new p5(barChart.draw, vis0);
};

const drawBubble = (data, container) => {
  // Create wrapper element
  const vis1 = createContainer(1);
  drawVisTitle(vis1, "Stations");
  drawVisDesc(vis1, "The number of stations per line.");

  // Append to container
  container.appendChild(vis1);

  // Process data
  const lineToStnCount = new Map();
  const stationSet = new Set();
  const filteredData = data.filter((d) => d.TrackNum === 1);
  filteredData.forEach((d) => {
    const numStations = d.TrackCircuits.reduce((accumulator, item) => {
      if (item.StationCode) {
        stationSet.add(item.StationCode);
      }

      return (accumulator += item.StationCode ? 1 : 0);
    }, 0);

    lineToStnCount.set(d.LineCode, numStations);
  });

  // Draw chart with p5.js
  const bubbleChart = new BubbleChart(lineToStnCount, vis1);
  new p5(bubbleChart.draw, vis1);
};

const drawOverlap = (data, container) => {
  // Create wrapper element
  const vis2 = createContainer(2);
  drawVisTitle(vis2, "Interlining");
  drawVisDesc(vis2, "The relative amount of shared track per pair of overlapping lines.");

  // Append to container
  container.appendChild(vis2);

  // Process data
  const filteredData = data.filter((d) => d.TrackNum === 1);

  const lineCodeToCkts = new Map();
  filteredData.forEach((line) => {
    const cktSet = getOrInitializeMapValue(lineCodeToCkts, line.LineCode, new Set());
    line.TrackCircuits.forEach((ckt) => cktSet.add(ckt.CircuitId));
  });

  const overlapMap = new Map();

  // Loop through line pairs
  for (const [lineCodeA, cktListA] of lineCodeToCkts.entries()) {
    for (const [lineCodeB, cktListB] of lineCodeToCkts.entries()) {
      if (lineCodeA === lineCodeB) continue;

      // Find overlapping circuits
      const sharedCkts = new Set();
      cktListA.forEach((cktId) => {
        if (cktListB.has(cktId)) {
          sharedCkts.add(cktId);
        }
      });

      if (sharedCkts.size > 0) {
        const key = [lineCodeA, lineCodeB].sort().join("-");

        // Create the map entry
        overlapMap.set(key, {
          [lineCodeA]: cktListA.size,
          [lineCodeB]: cktListB.size,
          overlap: sharedCkts.size,
        });
      }
    }
  }

  // Draw chart with p5.js
  const overlapChart = new OverlapChart(overlapMap, vis2);
  new p5(overlapChart.draw, vis2);
};

const drawPicto = (data, stations, container) => {
  // Create wrapper element
  const vis3 = createContainer(3);
  drawVisTitle(vis3, "Transfer Stations");
  drawVisDesc(vis3, "The lines served by each transfer station.");

  // Append to container
  container.appendChild(vis3);

  // Process data
  const stnCodeToName = new Map();
  stations.forEach((s) => stnCodeToName.set(s.code, s.name));

  const stnNameToCodes = new Map();
  data.forEach((route) => {
    route.TrackCircuits.forEach((circuit) => {
      const stnName = stnCodeToName.get(circuit.StationCode);
      if (!stnName) {
        return;
      }

      const stnCodesToLineGroups = getOrInitializeMapValue(stnNameToCodes, stnName, new Map());
      const lines = getOrInitializeMapValue(stnCodesToLineGroups, circuit.StationCode, new Set());
      lines.add(route.LineCode);
    });
  });

  const dataMap = new Map();
  Array.from(stnNameToCodes.entries()).map(([stnName, codesToLines]) => {
    const arr = [];
    Array.from(codesToLines.entries()).forEach(([stnCode, lineCodes]) => arr.push(...lineCodes));
    dataMap.set(stnName, arr);
  });

  // Draw chart with p5.js
  const pictoChart = new PictoChart(dataMap, vis3);
  new p5(pictoChart.draw, vis3);
};

const createContainer = (index) => {
  const visDiv = document.createElement("div");
  visDiv.classList.add("data-vis");
  visDiv.id = `data-vis-${index}`;

  return visDiv;
};

const drawVisTitle = (container, title) => {
  const titleElement = document.createElement("h2");
  titleElement.classList.add("vis-title");
  titleElement.textContent = title;

  container.appendChild(titleElement);
};

const drawVisDesc = (container, desc) => {
  const descElement = document.createElement("p");
  descElement.classList.add("vis-desc");
  descElement.textContent = desc;

  container.appendChild(descElement);
};

document.addEventListener("DOMContentLoaded", async () => main());
