import { fatLine } from "./svg/fat-line";
import { Lines } from "./lines/lines";

const line = [
  {
    x: 300,
    y: 350,
  },
  {
    x: 150,
    y: 350,
  },
  {
    x: 100,
    y: 500,
  },
  {
    x: 400,
    y: 500,
  },
  {
    x: 500,
    y: 50,
  },
];

const d = fatLine(line);
const svg = document.querySelector('svg');

svg.innerHTML += `<path d="${ d }" stroke="blue" fill="none" />`;

const l = new Lines();
l.saveLine(0, 0, 50, 50);
l.saveLine(100, 100, 50, 50);

l.saveLine(200, 200, 300, 300);
l.saveLine(300, 300, 220, 220);
console.log(l.lines.length, l.skippedLinesCount);
console.log(l.getShapes())
