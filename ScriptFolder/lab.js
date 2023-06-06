const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cellSize = 50;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let player;
let maze;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.walls = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    };
  }

  draw() {
    if (this.x === cols - 1 && this.y === rows - 1) {
      ctx.fillStyle = "green";
      ctx.fillRect((cols - 1) * cellSize, (rows - 1) * cellSize, cellSize, cellSize);
    } else {
      ctx.fillStyle = "#d98c34";
    }
    ctx.fillRect(this.x * this.size, this.y * this.size, this.size, 1);
    ctx.fillRect(this.x * this.size, (this.y + 1) * this.size - 1, this.size, 1);
    ctx.fillRect(this.x * this.size, this.y * this.size, 1, this.size);
    ctx.fillRect((this.x + 1) * this.size - 1, this.y * this.size, 1, this.size);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x * cellSize+5, this.y * cellSize+5, cellSize-10, cellSize-10);
  }

  move(x, y) {
    const newX = this.x + x;
    const newY = this.y + y;

    if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
      return;
    }

    if (x !== 0) {
      if (x === 1 && !maze[this.y][this.x].walls.right) {
        this.x += x;
      } else if (x === -1 && !maze[this.y][this.x].walls.left) {
        this.x += x;
      }
    } else if (y !== 0) {
      if (y === 1 && !maze[this.y][this.x].walls.bottom) {
        this.y += y;
      } else if (y === -1 && !maze[this.y][this.x].walls.top) {
        this.y += y;
      }
    }
    if (this.x === cols - 1 && this.y === rows - 1) {
        document.getElementById("modal").style.display = 'block';
        const sound = new Audio('./Voicing/modal.mp3');
        sound.play();
        document.getElementById("restart-button").onclick = function() {
          location.reload();
      }
   
      document.getElementById("main-page-button").onclick = function() {
          window.location.href = 'index.html';  // Измените этот URL на URL главной страницы вашего сайта
      }
    }
  }
}


function generateMaze() {
  const dfs = (x, y) => {
    const directions = [
      { x: 0, y: -1, w: "top", o: "bottom" },
      { x: 1, y: 0, w: "right", o: "left" },
      { x: 0, y: 1, w: "bottom", o: "top" },
      { x: -1, y: 0, w: "left", o: "right" },
    ];
    
    for (const dir of directions.sort(() => Math.random() - 0.5)) {
      const newX = x + dir.x;
      const newY = y + dir.y;

      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && Object.values(maze[newY][newX].walls).every(w => w === true)) {
        maze[y][x].walls[dir.w] = false;
        maze[newY][newX].walls[dir.o] = false;
        dfs(newX, newY);
      }
    }
  };

  maze = new Array(rows);
  for (let y = 0; y < rows; y++) {
    maze[y] = new Array(cols);
    for (let x = 0; x < cols; x++) {
      maze[y][x] = new Cell(x, y);
    }
  }

  dfs(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows));
  
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;

  for (const row of maze) {
    for (const cell of row) {
      cell.draw();
    }
  }

  player.draw();
  ctx.beginPath();
ctx.strokeStyle = "black";
ctx.lineWidth = 5;

// Iterate over all cells in the maze
for (const row of maze) {
  for (const cell of row) {
    const x = cell.x * cell.size;
    const y = cell.y * cell.size;

    // Draw the top wall
    if (cell.walls.top) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + cell.size, y);
    }

    // Draw the right wall
    if (cell.walls.right) {
      ctx.moveTo(x + cell.size, y);
      ctx.lineTo(x + cell.size, y + cell.size);
    }

    // Draw the bottom wall
    if (cell.walls.bottom) {
      ctx.moveTo(x, y + cell.size);
      ctx.lineTo(x + cell.size, y + cell.size);
    }

    // Draw the left wall
    if (cell.walls.left) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cell.size);
    }
  }
}

ctx.stroke(); 
}

function handleInput(e) {
  if (e.key === "ArrowUp") {
    player.move(0, -1);
  } else if (e.key === "ArrowDown") {
    player.move(0, 1);
  } else if (e.key === "ArrowLeft") {
    player.move(-1, 0);
  } else if (e.key === "ArrowRight") {
    player.move(1, 0);
  }

  draw();
}

function init() {
  generateMaze();
  player = new Player(0, 0);
  draw();

  window.addEventListener("keydown", handleInput);
}

function goBack() {
  window.location.href = 'index.html';
}

init();