let items = document.querySelectorAll(".item");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let canvasRect = canvas.getBoundingClientRect();
let offsetX, offsetY;
let draggedItem = null;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

context.fillStyle = "SkyBlue";
context.fillRect(0, 0, canvas.width, canvas.height / 2);

context.fillStyle = "ForestGreen";
context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

let itemsOnCanvas = [];

function drawItemsOnCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "SkyBlue";
    context.fillRect(0, 0, canvas.width, canvas.height / 2);
    context.fillStyle = "ForestGreen";
    context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    itemsOnCanvas.forEach(function (item) {
        context.drawImage(item.img, item.x, item.y, item.width, item.height);
    });
}

let draggedItemIndex = null;

items.forEach(function (item, index) {
  item.addEventListener("mousedown", function (e) {
    let imgElement = new Image();
    imgElement.src = item.src;
    draggedItemIndex = itemsOnCanvas.length;
    itemsOnCanvas.push({
        img: imgElement,
        width: item.clientWidth,
        height: item.clientHeight,
        x: e.clientX - canvasRect.left - item.clientWidth / 2,
        y: e.clientY - canvasRect.top - item.clientHeight / 2,
    });
    drawItemsOnCanvas();
  });
});

let minSize = 50;
let maxSize = 200;
let scaleStep = 10; // насколько увеличивается/уменьшается размер при каждом событии прокрутки

document.addEventListener("wheel", function(e) {
  if (draggedItemIndex !== null) {
    if (e.deltaY < 0) {
      // Прокрутка вверх
      if (itemsOnCanvas[draggedItemIndex].width < maxSize && itemsOnCanvas[draggedItemIndex].height < maxSize) {
        itemsOnCanvas[draggedItemIndex].width += scaleStep;
        itemsOnCanvas[draggedItemIndex].height += scaleStep;
      }
    } else {
      // Прокрутка вниз
      if (itemsOnCanvas[draggedItemIndex].width > minSize && itemsOnCanvas[draggedItemIndex].height > minSize) {
        itemsOnCanvas[draggedItemIndex].width -= scaleStep;
        itemsOnCanvas[draggedItemIndex].height -= scaleStep;
      }
    }
    drawItemsOnCanvas();
  }
});


document.addEventListener("mousemove", function (e) {
  if (draggedItemIndex !== null) {
    itemsOnCanvas[draggedItemIndex].x = e.clientX - canvasRect.left - itemsOnCanvas[draggedItemIndex].width / 2;
    itemsOnCanvas[draggedItemIndex].y = e.clientY - canvasRect.top - itemsOnCanvas[draggedItemIndex].height / 2;
    drawItemsOnCanvas();
  }
});

document.addEventListener("mouseup", function (e) {
  draggedItemIndex = null;
});


document.querySelector("#save-btn").addEventListener("click", function () {
  let link = document.createElement("a");
  link.download = "myworld.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});


document.querySelector("#home-btn").addEventListener("click", function () {
    window.location.href = "index.html";
});

document.querySelector("#undo-btn").addEventListener("click", function () {
    if (itemsOnCanvas.length > 0) {
        itemsOnCanvas.pop();
        drawItemsOnCanvas();
    }
});
