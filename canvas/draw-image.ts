export function drawImageOnCanvas(
  imageSrc:string,
  size: 500,
  callback:(canvas:HTMLCanvasElement) => void,
) {
  const canvas:HTMLCanvasElement = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx:CanvasRenderingContext2D = canvas.getContext('2d');

  const image = new Image();
  image.addEventListener('load', () => {
    // Get the largest square from the image
    let yOffset = 0;
    let xOffset = 0;
    let imageSize;

    if (image.height > image.width) {
      yOffset = (image.height - image.width) / 2;
      imageSize = image.width;
    } else {
      xOffset = (image.width - image.height) / 2;
      imageSize = image.height;
    }

    ctx.drawImage(image, xOffset, yOffset, imageSize, imageSize, 0, 0, size, size);

    callback(canvas);
  });

  // Load image
  image.src = imageSrc;
}
