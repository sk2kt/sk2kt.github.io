const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapes = [
  {id: 1, color: 'yellow', shape: [[0, 0], [400, 0], [200, 200]]}, // Big Triangle 1
  {id: 2, color: 'red', shape: [[0, 0], [0, 400], [200, 200]]}, // Big Triangle 2
  {id: 3, color: 'green', shape: [[400, 0], [400, 200], [300, 100]]}, // Small Triangle 1
  {id: 4, color: 'blue', shape: [[100, 300], [200, 200], [300, 300]]}, // Small Triangle 2
  {id: 5, color: 'purple', shape: [[200, 400], [400, 400], [400, 200]]}, // Medium Triangle
  {id: 6, color: 'orange', shape: [[200, 200], [300, 100], [400, 200], [300, 300]]}, // Square
  {id: 7, color: 'darkgrey', shape: [[0, 400], [100, 300], [300, 300], [200, 400]]} // Parallelogram
].map(shape => ({
  ...shape,
  shape: shape.shape.map(coord => coord.map(dim => dim * 0.5))
}));

const saveButton = document.getElementById('save-button');

const canvasWidth = 1100;
const canvasHeight = 650;

shapes.forEach(shape => {
  shape.shape.forEach(coord => {
    coord[0] *= 2;
    coord[1] *= 2;
  });
});

let selectedShape = null;
let startX = 0;
let startY = 0;
let dragging = false;
let offset = { x: 0, y: 0 };


function drawShapes() {
    shapes.forEach(shape => {
      ctx.fillStyle = shape.color;
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
  
      ctx.beginPath();
      ctx.moveTo(shape.shape[0][0], shape.shape[0][1]);
  
      for (let i = 1; i < shape.shape.length; i++) {
        ctx.lineTo(shape.shape[i][0], shape.shape[i][1]);
      }
  
      ctx.closePath();
      ctx.fill();
    });
  }

function findSelectedShape(x, y) {
  for (let i = 0; i < shapes.length; i++) {
    ctx.beginPath();
    ctx.moveTo(shapes[i].shape[0][0], shapes[i].shape[0][1]);
    for (let j = 1; j < shapes[i].shape.length; j++) {
      ctx.lineTo(shapes[i].shape[j][0], shapes[i].shape[j][1]);
    }
    ctx.closePath();
    if (ctx.isPointInPath(x, y)) {
      return shapes[i];
    }
  }
  return null;
}

function onMouseDown(e) {
  e.preventDefault();
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  selectedShape = findSelectedShape(x, y);
  if (selectedShape) {
    startX = x;
    startY = y;
    offset.x = x - selectedShape.shape[0][0];
    offset.y = y - selectedShape.shape[0][1];
    dragging = true;
  }
}

function onMouseMove(e) {
  e.preventDefault();
  if (!dragging) return;
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  const xDiff = x - startX;
  const yDiff = y - startY;

  let updatedShapeCoords = selectedShape.shape.map(coord => {
    const newX = coord[0] + xDiff;
    const newY = coord[1] + yDiff;
    return [newX, newY];
  });

  const withinCanvasBounds = updatedShapeCoords.every(([x, y]) => {
    return x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight;
  });

  if (withinCanvasBounds) {
    selectedShape.shape = updatedShapeCoords;
    startX = x;
    startY = y;
    draw();
  }
}

function rotateShape(shape, angle) {
  const radians = (Math.PI / 180) * angle;
  const centroid = [0, 0];
  shape.shape.forEach(([x, y]) => {
      centroid[0] += x; // x
      centroid[1] += y; // y
  });
  centroid[0] /= shape.shape.length;
  centroid[1] /= shape.shape.length;

  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const rotatedShape = shape.shape.map(([x, y]) => {
      const dx = x - centroid[0];
      const dy = y - centroid[1];
      return [
          cos * dx - sin * dy + centroid[0],
          sin * dx + cos * dy + centroid[1]
      ];
  });

  return rotatedShape;
}

function onWheel(e) {
  e.preventDefault();
  if (!selectedShape) return;
  const direction = e.deltaY > 0 ? -1 : 1;
  const angle = direction * 9;
  selectedShape.shape = rotateShape(selectedShape, angle);
  draw();
}

function onMouseUp(e) {
  e.preventDefault();
  dragging = false;
  selectedShape = null;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShapes();
}

saveButton.addEventListener('click', function() {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'tangram.png';
  link.click();
});

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('wheel', onWheel);

draw();