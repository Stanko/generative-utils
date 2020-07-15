import Circle from "./circle";
import { getDistanceBetweenPoints } from "../points"

interface ITopLeft {
  x: number;
  y: number;
}

interface IOptions {
  speed?: number;
  minRadius?: number;
  maxRadius?: number;
  topLeft?: ITopLeft;
  width: number;
  height: number;
  areaToCover?: number;
  strokeWidth?: number;
};

const dist = (x1, y1, x2, y2) => getDistanceBetweenPoints({ x: x1, y: y1 }, { x: x2, y: y2 });

const defaultOptions:IOptions = {
  speed: 1,
  minRadius: 5,
  maxRadius: 30,
  topLeft: {
    x: 0,
    y: 0,
  },
  width: 300,
  height: 300,
  // circle: IS_BROWSER ? (window as any).circle : () => {}, // p5 circle function
  areaToCover: 0.8,
  strokeWidth: 1,
}

function getArea(circles, x, y) {
  if (circles[x] && circles[x][y]) {
    return circles[x][y];
  }

  return null;
}

function getNeighboringAreas(circles, x, y) {
  const neighbors = [
    getArea(circles, x, y),
    getArea(circles, x, y + 1),
    getArea(circles, x, y - 1),
    getArea(circles, x + 1, y),
    getArea(circles, x + 1, y + 1),
    getArea(circles, x + 1, y - 1),
    getArea(circles, x - 1, y),
    getArea(circles, x - 1, y + 1),
    getArea(circles, x - 1, y - 1),
  ];

  return neighbors.filter(item => item !== null);
}


function checkNeighboringCircles(circles, circle, x, y, options, isNew = false) {
  const areasToSearch = getNeighboringAreas(circles, x, y);
        
  const circlesToCheck = [];

  areasToSearch.forEach(currentArea => {
    circlesToCheck.push(...currentArea);
  });

      
  if (circle.r > options.maxRadius) {
    circle.growing = false;
    circle.r = options.maxRadius;
  }

  // Does it overlap any previous circles?
  for (let j = 0; j < circlesToCheck.length; j++) {
    let other = circlesToCheck[j];

    if (other !== circle) {
      let distance = dist(circle.x, circle.y, other.x, other.y);
      const minDistance = circle.r + other.r;
      const diff = minDistance - (distance - options.strokeWidth);

      if (isNew) {
        if (minDistance > distance) {
          return false;
        }
      } else {
        if (diff > 0) {
          circle.r -= diff;
          circle.growing = false;
        }
      } 
    }
  }

  return true;
}

export function circlePacking(userOptions:IOptions) {
  const startTime = new Date().getTime();

  const options:IOptions = {
    ...defaultOptions,
    ...userOptions,
  };


  const areaThreshold = options.width * options.height * options.areaToCover;

  const maxX = Math.ceil(options.width / (options.maxRadius * 2));
  const maxY = Math.ceil(options.height / (options.maxRadius * 2));
  
  // All the circles
  const circles = [];
  
  for (let x = 0; x < maxX; x++) {
    circles[x] = [];

    for (let y = 0; y < maxY; y++) {
      circles[x][y] = [];
    } 
  }

  let coveredArea = 0;
  let lastCoveredArea = 0;
  let coveredAreaDidNotChange = 0;

  while (true) {
    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        const area = circles[x][y];

        area.forEach(circle => {
          // Is the circle still growing
          if (circle.growing) {
            circle.grow();

            circle.isOutOfBounds = 
              circle.x + circle.r >= options.width + options.topLeft.x || 
              circle.x - circle.r <= options.topLeft.x ||
              circle.y + circle.r >= options.height + options.topLeft.y || 
              circle.y - circle.r <= options.topLeft.y;
      
            // Stop it from growing if it is stuck to an edge
            if (circle.isOutOfBounds) {
              circle.growing = false;
            }

            checkNeighboringCircles(circles, circle, x, y, options, false);
          }
        });
      } 
    }

    // Try N times
    for (let i = 0; i < 1000; i++) {
      const c = addCircle(circles, options.width, options.height, options);

      if (c) {
        coveredArea += c.r * c.r * Math.PI;
        break;
      }
    }

    if (coveredArea === lastCoveredArea) {
      coveredAreaDidNotChange++;
    } else {
      coveredAreaDidNotChange = 0;
    }

    lastCoveredArea = coveredArea;
    
    // We can't make any more
    if (coveredArea > areaThreshold || coveredAreaDidNotChange > 100) {
      const circlesFlat = [];

      circles.forEach(row => {
        row.forEach(area => {
          circlesFlat.push(...area);
        });
      });

      console.log(`circle packing done, generated ${ circlesFlat.length } circles, ${ (new Date().getTime() - startTime) / 1000 }s`);

      return circlesFlat.map(c => {
        return {
          x: parseFloat(c.x.toFixed(2)),
          y: parseFloat(c.y.toFixed(2)),
          r: parseFloat(c.r.toFixed(2)),
        };
      });
    }
  }
  
}

// Add one circle
function addCircle(circles, width, height, options) {
  const circleCenterX = Math.random() * width + options.topLeft.x;
  const circleCenterY = Math.random() * height + options.topLeft.y;
  
  const circleX = Math.floor(circleCenterX / (options.maxRadius * 2));
  const circleY = Math.floor(circleCenterY / (options.maxRadius * 2));
  
  // New circle
  let newCircle = new Circle(circleCenterX, circleCenterY, options.minRadius, options.speed);

  // Is it in an ok spot?
  if (checkNeighboringCircles(circles, newCircle, circleX, circleY, options, true)) {
    // If it is, add it and return it
    circles[circleX][circleY].push(newCircle);
    return newCircle;
  }
  
  return false;
}
