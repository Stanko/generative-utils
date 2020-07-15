export default function Circle(x, y, r, speed) {
  this.growing = true;
  this.x = x;
  this.y = y;
  this.r = r;
  this.speed = speed;
  this.minSpeed = speed * 0.2;
  this.speedFactor = speed * 0.05;
}

// Grow
Circle.prototype.grow = function() {
  this.r += this.speed;

  // Slow down the speed of growth
  if (this.speed > this.minSpeed) {
    this.speed -= this.speedFactor;
  }
}
