
// Circle object
export default function Circle(x, y, r, speed, maxX, maxY) {
  this.growing = true;
  this.x = x;
  this.y = y;
  this.r = r;
  this.maxX = maxX
  this.maxY = maxY
  this.speed = speed;
  this.minSpeed = speed * 0.2;
  this.speedFactor = speed / 20;
}

// Grow
Circle.prototype.grow = function() {
  this.r += this.speed;
  if (this.speed > this.minSpeed) {
    this.speed -= this.speedFactor;
  }
}
