const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapes = [
    {id: 1, color: 'yellow', shape: [[0, 0], [60, 0], [60, 80], [0, 80]]},
    {id: 2, color: 'orange', shape: [[60, 0], [120, 0], [90, 30]]}, 
    {id: 3, color: 'red', shape: [[120, 0], [180, 0], [150, 30]]}, 
    {id: 4, color: 'green', shape: [[0, 80], [60, 80], [0, 160]]},
    {id: 5, color: 'purple', shape: [[60, 60], [120, 60], [120, 120], [60, 120]]},
    {id: 6, color: 'blue', shape: [[120, 60], [180, 60], [150, 120]]}, 
    {id: 7, color: 'darkgrey', shape: [[30, 135], [30, 165], [0, 150], [60, 150], [30, 195]]},
    {id: 8, color: 'cyan', shape: [[200, 0], [260, 0], [230, 60]]},
    {id: 9, color: 'magenta', shape: [[200, 100], [230, 60], [260, 100], [230, 140]]}, 
    {id: 10, color: 'brown', shape: [[300, 0], [330, 0], [360, 40], [330, 80], [300, 80], [270, 40]]},
    {id: 11, color: 'black', shape: [[400, 0], [430, 0], [460, 40], [460, 80], [430, 120], [400, 120], [370, 80], [370, 40]]}
].map(shape => ({
    ...shape,
    shape: shape.shape.map(coord => coord.map(dim => dim * 0.60))
})); 

const canvasWidth = 700;
const canvasHeight = 700;

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
      ctx.shadowColor = 'gray';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
  
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

function onMouseUp(e) {
  e.preventDefault();
  dragging = false;
  selectedShape = null;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShapes();
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);

draw();