import { getRhombusOnIntersection } from "./get-rhombus";
import { generateDeBruijnGridLines } from "./generate-lines";
import { getPointOnLine, getDistanceBetweenPoints } from "../points";
import { getVector } from "../vectors";

export interface IUserOptions {
  step?: number;
  randomizeStep?: number;
  randomizeAngle?: number;
  rhombusSideLength?: number;
  randomlyExcludeLines?: boolean;
  randomlyRemoveEdgeRhombuses?: number;
}

export interface IOptions {
  step: number;
  randomizeStep: number;
  randomizeAngle: number;
  rhombusSideLength: number;
  randomlyExcludeLines: boolean;
  randomlyRemoveEdgeRhombuses?: number;
}


function getEdgesCenters(polygon) {
  return polygon.map((currentPoint, index) => {
    const nextPoint = polygon[(index + 1) % polygon.length];
    return getPointOnLine(currentPoint, nextPoint, 0.5);
  });
} 

function getEdgeVectors(polygon) {
  return polygon.map((currentPoint, index) => {
    const nextPoint = polygon[(index + 1) % polygon.length];
    return getVector(currentPoint, nextPoint);
  });
} 

function setClosestEdges(r1, r2) {
  let distances = [];

  r1.edgeCenters.forEach((edgeCenter1, edgeIndex1) => {
    r2.edgeCenters.forEach((edgeCenter2, edgeIndex2) => {
      distances.push({
        distance: getDistanceBetweenPoints(edgeCenter1, edgeCenter2),
        edgeIndex1,
        edgeIndex2,
      });
    });
  });

  let closestOppositeVectors;

  distances.sort((a, b) => {
    return a.distance - b.distance;
  });

  for (let i = 0; i < distances.length; i++) {
    const d = distances[i];

    const edgeVector1 = r1.edgeVectors[d.edgeIndex1];
    const edgeVector2 = r2.edgeVectors[d.edgeIndex2];


    const offsetX = parseFloat(Math.abs(edgeVector1.x + edgeVector2.x).toFixed(2));
    const offsetY = parseFloat(Math.abs(edgeVector1.y + edgeVector2.y).toFixed(2));

    const isDirectionOpposite = offsetX === 0 && offsetY === 0;

    if (isDirectionOpposite) {
      closestOppositeVectors = d;
      break;
    }
  }

  if (!closestOppositeVectors) {
    console.warn('No opposite vectors:')
    console.log(r1, r2);
  } else {
    r1[r2.id] = closestOppositeVectors.edgeIndex1;
    r2[r1.id] = closestOppositeVectors.edgeIndex2;
  }
}

function getNeighbor(linesRhombuses, lineIndex, position) {
  if (position >= 0 && position < linesRhombuses[lineIndex].length) {
    return linesRhombuses[lineIndex][position];
  }

  return null;
}

function findNeighbors(rhombus, linesRhombuses) {
  const neighbors = [];
  const position1 = rhombus[`positionOn${rhombus.index1}`];
  const position2 = rhombus[`positionOn${rhombus.index2}`];

  neighbors.push(getNeighbor(linesRhombuses, rhombus.index1, position1 - 1));
  neighbors.push(getNeighbor(linesRhombuses, rhombus.index1, position1 + 1));
  neighbors.push(getNeighbor(linesRhombuses, rhombus.index2, position2 - 1));
  neighbors.push(getNeighbor(linesRhombuses, rhombus.index2, position2 + 1));

  // Filter out nulls
  return neighbors.filter(r => !!r);
}

function connectTwoRhombuses(r1, r2) {
  const edgeCenterIndex1 = r1[r2.id];
  const edgeCenterIndex2 = r2[r1.id];

  if (typeof edgeCenterIndex1 !== 'number' || typeof edgeCenterIndex2 !== 'number') {
    console.log(r1, r2, edgeCenterIndex1, edgeCenterIndex2)
    return;
  }

  const edgeCenter1 = r1.edgeCenters[edgeCenterIndex1];
  const edgeCenter2 = r2.edgeCenters[edgeCenterIndex2];

  const vector = getVector(edgeCenter2, edgeCenter1);

  r2.r = r2.r.map(p => {
    return {
      x: p.x + vector.x,
      y: p.y + vector.y,
    };
  });

  r2.edgeCenters = r2.edgeCenters.map(p => {
    return {
      x: p.x + vector.x,
      y: p.y + vector.y,
    };
  });

  r2.center = {
    x: r2.center.x + vector.x,
    y: r2.center.y + vector.y,
  };
}

function fixRhombusAndConnectItWithNeighbors(rhombus, linesRhombuses) {
  if (rhombus.done) {
    return;
  } else {
    rhombus.done = true;

    const neighbors = findNeighbors(rhombus, linesRhombuses);

    neighbors.forEach(neighbor => {
      connectTwoRhombuses(rhombus, neighbor);
    });

    neighbors.forEach(r => fixRhombusAndConnectItWithNeighbors(r, linesRhombuses));
  }
}

const defaultOptions:IOptions = {
  step: 200,
  randomizeStep: 0,
  randomizeAngle: 0,
  rhombusSideLength: 30,
  randomlyExcludeLines: false,
  randomlyRemoveEdgeRhombuses: 0,
}

export function generateGrid(
  n:number, 
  w:number, 
  h:number, 
  userOptions:IUserOptions = {}
) {
  const options:IOptions = {
    ...defaultOptions,
    ...userOptions,
  };

  const lines = generateDeBruijnGridLines(n, w, h, userOptions).flat();

  // lines.forEach(l => {
  //   line(
  //     l[0].x, 
  //     l[0].y, 
  //     l[1].x, 
  //     l[1].y
  //   )
  // })

  const linesRhombuses = [];
  const allRhombuses = [];

  // Create rhombus on each intersection
  for (let index1 = 0; index1 < lines.length; index1++) {
    const line1 = lines[index1];

    for (let index2 = index1 + 1; index2 < lines.length; index2++) {
      const line2 = lines[index2];

      const r = getRhombusOnIntersection(
        line1[0].x, 
        line1[0].y, 
        line1[1].x, 
        line1[1].y,
        line2[0].x, 
        line2[0].y, 
        line2[1].x, 
        line2[1].y,
        options.rhombusSideLength
      );

      if (r) {
        const rh = {
          id: `${index1}-${index2}`,
          ...r,
          edgeCenters: getEdgesCenters(r.r),
          edgeVectors: getEdgeVectors(r.r),
          index1,
          index2
        };
        if (!linesRhombuses[index1]) {
          linesRhombuses[index1] = [];
        }
        if (!linesRhombuses[index2]) {
          linesRhombuses[index2] = [];
        }

        linesRhombuses[index1].push(rh);
        linesRhombuses[index2].push(rh);
        allRhombuses.push(rh);
      }
    }
  }

  linesRhombuses.forEach((rhombuses, index) => {
    linesRhombuses[index] = rhombuses.sort((a, b) => {
      return a.center.x - b.center.x || a.center.y - b.center.y;
    });

    if (options.randomlyRemoveEdgeRhombuses) {
      const max = Math.floor(linesRhombuses[index].length * options.randomlyRemoveEdgeRhombuses);

      const popCount = Math.floor(Math.random() * max);
      const shiftCount = Math.floor(Math.random() * max);

      for (let i = 0; i < popCount; i++) {
        if (linesRhombuses[index].length > 1) {
          linesRhombuses[index].pop();
        }
      }
      for (let i = 0; i < shiftCount; i++) {
        if (linesRhombuses[index].length > 1) {
          linesRhombuses[index].shift();
        }
      }
    }
  });

  linesRhombuses.forEach((rhombuses, index1) => {
    rhombuses.forEach((r, index2) => {
      r[`positionOn${index1}`] = index2;

      if (rhombuses[index2 + 1]) {
        setClosestEdges(r, rhombuses[index2 + 1]);
      }
    });
  });

  fixRhombusAndConnectItWithNeighbors(allRhombuses[0], linesRhombuses);

  const averageCenter = allRhombuses.reduce((acc, current) => {
    return {
      x: acc.x + current.center.x,
      y: acc.y + current.center.y,
    };
  }, { x: 0, y: 0 });

  averageCenter.x = w / 2 - averageCenter.x / allRhombuses.length;
  averageCenter.y = h / 2 - averageCenter.y / allRhombuses.length;

  allRhombuses.forEach(rhombus => {
    rhombus.r = rhombus.r.map(p => {
      return {
        x: p.x + averageCenter.x,
        y: p.y + averageCenter.y,
      };
    });
    rhombus.center = {
      x: rhombus.center.x + averageCenter.x,
      y: rhombus.center.y + averageCenter.y,
    };
  });
  
  return allRhombuses;
}