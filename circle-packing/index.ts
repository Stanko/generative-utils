import Circle from "./circle";


interface IOptions {
  speed?: number;
  minRadius?: number;
  maxRadius?: number;
  x?: number;
  y?: number;
  width: number;
  height: number;
  circle?: (x:number, y:number, r:number) => void;
  areaToCover?: number;
};

const IS_BROWSER = typeof window !== 'undefined';

const defaultOptions:IOptions = {
  speed: 1,
  minRadius: 5,
  maxRadius: 30,
  // radiusThreshold
  x: 0,
  y: 0,
  width: 300,
  height: 300,
  circle: IS_BROWSER ? (window as any).circle : () => {}, // p5 circle function
  areaToCover: 0.8,
}

/**
 * Depends on p5 for now
 */
export function circlePacking(userOptions:IOptions) {
  const options:IOptions = {
    ...defaultOptions,
    ...userOptions,
  };

  const areaThreshold = options.width * options.height * options.areaToCover;
  let coveredArea = 0;
  let lastCoveredArea = 0;
  let coveredAreaDidNotChange = 0;

  // All the circles
  const circles = [];

  let loopCount = 1;
  while(loopCount++) {
    // All the circles
    for (let i = 0; i < circles.length; i++) {
      let c = circles[i];

      c.isOutOfBounds = 
        c.x + c.r >= options.width + options.x || 
        c.x - c.r <= options.x ||
        c.y + c.r >= options.height + options.y || 
        c.y - c.r <= options.y;

      // if (!c.isOutOfBounds) {
      //   // c.show();
      // }
      
      // Is it a growing one?
      if (c.growing) {
        c.grow();
        // Does it overlap any previous circles?
        for (let j = 0; j < circles.length; j++) {
          let other = circles[j];
          if (other != c) {
            let d = dist(c.x, c.y, other.x, other.y);

            const diff = (c.r + other.r) - (d - 1);

            if (diff > 0) {
              c.r -= diff;
              c.growing = false;
            }
          }
          
          if (c.r > options.maxRadius) {
            c.growing = false;
          }
        }
        
        // Is it stuck to an edge?
        if (c.growing) {
          c.growing = !c.isOutOfBounds;
        }
      }
    }
    
    // How many
    let count = 0;
    // Try N times
    for (let i = 0; i < 1000; i++) {
      if (addCircle(circles, options.width, options.height, options.x, options.y, options)) {
        const c = circles[circles.length - 1];
        
        
        coveredArea += c.r * c.r * Math.PI;

        count++;
        break;
      }
    }

    if (coveredArea === lastCoveredArea) {
      coveredAreaDidNotChange++;
    } else {
      coveredAreaDidNotChange = 0;
    }

    console.log(coveredArea, lastCoveredArea, areaThreshold, coveredAreaDidNotChange);

    lastCoveredArea = coveredArea;
    
    // We can't make any more
    if (coveredArea > areaThreshold || coveredAreaDidNotChange > 100) {
      console.log('done');
      return circles;
    }
  }
  
}

// Add one circle
function addCircle(circles, width, height, x, y, options) {
  // Here's a new circle
  let newCircle = new Circle(random(width) + x, random(height) + y, options.minRadius, options.speed, x + width, y + height);
  // Is it in an ok spot?
  for (let i = 0; i < circles.length; i++) {
    let other = circles[i];
    let d = dist(newCircle.x, newCircle.y, other.x, other.y);
    
    if (d < other.r + newCircle.r) {
      newCircle = undefined;
      break;
    }
  }

  // If it is, add it
  if (newCircle) {
    circles.push(newCircle);
    return true;
  } else {
    return false;
  }
}
