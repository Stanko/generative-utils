export class Gaussian {
  private mean:number;
  private sd:number;
  private gaussianPrevious:boolean = false;
  private y2:number = 0;

  constructor(mean = 0, sd = 1) {
    this.mean = mean;
    this.sd = sd;
  }

  public get() {
    let y1;
    let x1;
    let x2;
    let w;

    if (this.gaussianPrevious) {
      y1 = this.y2;
      this.gaussianPrevious = false;
    } else {
      do {
        // x1 = this.random(2) - 1;
        // x2 = this.random(2) - 1;
        x1 = Math.random() * 2 - 1;
        x2 = Math.random() * 2 - 1;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1);

      w = Math.sqrt(-2 * Math.log(w) / w);

      y1 = x1 * w;
      this.y2 = x2 * w;

      this.gaussianPrevious = true;
    }
  
    return y1 * this.sd + this.mean;
  };
}

