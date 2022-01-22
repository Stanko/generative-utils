const getPolygonPoints = (polygon, density = 0.3, offsetValue, sideName) => {
  const points = [];
  let tree = new kdTree([], distance, ['0', '1']);
  const boundingBox = getBoundingBox(polygon);
  const offset = new Offset();

  if (offsetValue > 0) {
    polygon = polygon.map((polygonPart, index) => {
      if (index === 0) {
        try {
          return offset.data(polygonPart).padding(offsetValue)[0];
        } catch (e) {
          // Padding is bigger than the polygon
          return [];
        }
      } else {
        return offset.data(polygonPart).margin(offsetValue)[0];
      }
    });
  }

  // area of the main polygon
  let area = getArea(polygon[0]);

  // remove holes
  polygon.forEach((hole, index) => {
    if (index > 0) {
      area -= getArea(hole);
    }
  });

  while (points.length < density * area) {
    // while (points.length < 10) {
    let point = null;
    if (sideName === 'front') {
      point = [
        // boundingBox.left + Math.random() * boundingBox.width,
        boundingBox.left +
          easings.easeInCubic(Math.random()) * boundingBox.width,
        boundingBox.bottom +
          easings.easeInCubic(Math.random()) * boundingBox.height,
      ];
    } else if (sideName === 'top') {
      point = [
        boundingBox.left + Math.random() * boundingBox.width,
        boundingBox.bottom +
          easings.easeOutQuad(Math.random()) * boundingBox.height,
      ];
    } else {
      point = [
        boundingBox.left +
          easings.easeOutQuad(Math.random()) * boundingBox.width,
        boundingBox.bottom + Math.random() * boundingBox.height,
      ];
    }

    const isInside = inside(point, polygon);

    if (isInside === true || isInside === 0) {
      const nearest = tree.nearest(point, 1, 1);
      if (nearest.length == 0) {
        points.push(point);
        tree.insert(point);
      }
    }
  }

  return points;
};