import { compareVectors } from "../vectors";

export class Lines {
  public lines:any[]
  public skippedLinesCount:number

  private shapes:any[]

  constructor() {
    this.lines = [];
    this.skippedLinesCount = 0;
  }

  public saveLine(x1:number, y1:number, x2:number, y2:number) {  
    for (let i = 0; i < this.lines.length; i++) {
      const current = this.lines[i];
      const isSame = 
        current.x1 === x1 &&
        current.y1 === y1 &&
        current.x2 === x2 &&
        current.y2 === y2;
      const isSameButReverse = 
        current.x1 === x2 &&
        current.y1 === y2 &&
        current.x2 === x1 &&
        current.y2 === y1;
  
      if (isSame || isSameButReverse) {
        this.skippedLinesCount++;
        return;
      }
    }
  
    this.lines.push({
      x1,
      y1,
      x2,
      y2,
    });
  }

  getShapes() {
    this.makeShapesFromLines();

    return this.shapes;
  }

  private makeShapesFromLines() {
    // Copy lines
    this.shapes = this.lines.map(l => [...l]);

    for (let i = 0; i < this.shapes.length; i++) {
      const line1 = this.shapes[i];

      for (let j = 0; j < this.shapes.length; j++) {
        if (i === j) {
          continue;
        }
        const line2 = this.shapes[j];

        const p11 = line1[0];
        const p12 = line1[line1.length - 1];

        const p21 = line2[0];
        const p22 = line2[line2.length - 1];

        let found = false;

        if (compareVectors(p11, p21)) {
          line1.unshift(p22);
          found = true;
        } else if (compareVectors(p11, p22)) {
          line1.unshift(p21);
          found = true;
        } else if (compareVectors(p12, p21)) {
          line1.push(p22);
          found = true;
        } else if (compareVectors(p12, p22)) {
          line1.push(p21);
          found = true;
        } 

        if (found) {
          this.shapes.splice(j, 1);

          this.makeShapesFromLines();
          break;
        }
      };
    }
  }
}

