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

items.forEach(function (item) {
  item.addEventListener("mousedown", function (e) {
      let imgElement = new Image();
      imgElement.src = item.src;

      draggedItem = {
          img: imgElement,
          width: item.clientWidth,
          height: item.clientHeight,
          x: e.offsetX,
          y: e.offsetY,
      };

      // Установка размеров перетаскиваемого изображения
      draggedItem.img.style.width = `${draggedItem.width}px`;
      draggedItem.img.style.height = `${draggedItem.height}px`;

      offsetX = e.offsetX;
      offsetY = e.offsetY;
      document.body.appendChild(draggedItem.img);
  });
});


document.addEventListener("mousemove", function (e) {
    if (draggedItem) {
        draggedItem.img.style.position = "absolute";
        draggedItem.img.style.left = `${e.pageX - offsetX}px`;
        draggedItem.img.style.top = `${e.pageY - offsetY}px`;
    }
});

document.addEventListener("mouseup", function (e) {
    if (draggedItem) {
        if (
            e.clientX > canvasRect.left &&
            e.clientX < canvasRect.right &&
            e.clientY > canvasRect.top &&
            e.clientY < canvasRect.bottom
        ) {
            let itemData = {
                img: draggedItem.img,
                width: draggedItem.width,
                height: draggedItem.height,
                x: e.pageX - canvasRect.left - offsetX,
                y: e.pageY - canvasRect.top - offsetY,
            };
            itemsOnCanvas.push(itemData);
            drawItemsOnCanvas();
            document.body.removeChild(draggedItem.img);
        } else {
            document.body.removeChild(draggedItem.img);
        }
        draggedItem = null;
    }
});

document.querySelector("#save-btn").addEventListener("click", function () {
    html2canvas(document.querySelector("#canvas")).then((canvas) => {
        let link = document.createElement("a");
        link.download = "myworld.png";
        link.href = canvas.toDataURL();
        link.click();
    });
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
