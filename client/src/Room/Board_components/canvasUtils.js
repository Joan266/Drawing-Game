import { Line } from 'react-konva';

const commonLineProps = (line) => ({
  key: line.key,
  points: line.points,
  stroke: line.color,
  strokeWidth: getLineWidth(line.tool),
  tension: 0.5,
  lineCap: getLineCap(line.tool),
  lineJoin: "round",
  globalCompositeOperation: 'source-over',
});

const getLineWidth = (tool) => {
  switch (tool) {
    case 'pencil':
      return 1;
    case 'paintRoller':
      return 100;
    case 'brush':
      return 5;
    case 'biggerBrush':
      return 20;
    default:
      return 5;
  }
};

const getLineCap = (tool) => (tool === 'paintRoller' || tool === 'biggerBrush' ? 'square' : 'round');

export const renderLines = (lines) => (
  lines.map((line) => <Line {...commonLineProps(line)} />)
); 