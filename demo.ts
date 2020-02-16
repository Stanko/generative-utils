import { fatLine } from "./svg/fat-line";

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