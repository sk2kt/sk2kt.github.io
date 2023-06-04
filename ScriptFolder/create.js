let items = document.querySelectorAll(".item");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let canvasRect = canvas.getBoundingClientRect();
let offsetX, offsetY;
let draggedItem = null;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;


// Заливка верхней половины холста голубым цветом
context.fillStyle = "SkyBlue";
context.fillRect(0, 0, canvas.width, canvas.height / 2);

// Заливка нижней половины холста светло-зеленым цветом
context.fillStyle = "ForestGreen";
context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);



items.forEach(function (item) {
    item.addEventListener("mousedown", function (e) {
        draggedItem = item.cloneNode(true);
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        document.body.appendChild(draggedItem);
    });
});

document.addEventListener("mousemove", function (e) {
    if (draggedItem) {
        draggedItem.style.position = "absolute";
        draggedItem.style.left = `${e.pageX - offsetX}px`;
        draggedItem.style.top = `${e.pageY - offsetY}px`;
    }
});

document.addEventListener("mouseup", function (e) {
    if (draggedItem) {
        if (e.clientX > canvasRect.left && e.clientX < canvasRect.right && e.clientY > canvasRect.top && e.clientY < canvasRect.bottom) {
            draggedItem.style.left = `${e.pageX - canvasRect.left - offsetX}px`;
            draggedItem.style.top = `${e.pageY - canvasRect.top - offsetY}px`;
            canvas.appendChild(draggedItem);
        } else {
            document.body.removeChild(draggedItem);
        }
        draggedItem = null;
    }
});

document.querySelector('#save-btn').addEventListener('click', function() {
  html2canvas(document.querySelector("#canvas")).then(canvas => {
    let link = document.createElement('a');
    link.download = 'myworld.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.querySelector('#home-btn').addEventListener('click', function() {
  window.location.href = 'index.html'; 
});

document.querySelector('#undo-btn').addEventListener('click', function() {
  if (canvas.lastChild) {
    canvas.removeChild(canvas.lastChild);
  }
});
