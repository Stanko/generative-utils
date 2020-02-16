export function createSvg(svgWidth:number, svgHeight:number, className:string, moveToCenter:boolean):SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const midWidth = moveToCenter ? svgWidth / -2 : 0;
  const midHeight = moveToCenter ? svgHeight / -2 : 0;

  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('class', className);
  svg.setAttribute('viewBox', `${ midWidth } ${ midHeight } ${ svgWidth } ${ svgHeight }`);

  return svg;
}
