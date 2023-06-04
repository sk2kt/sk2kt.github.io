window.onload = function() {
    var shapes = document.getElementsByClassName("shape");
    var holes = document.getElementsByClassName("hole");

    function isOverlapping(element1, element2) {
        var rect1 = element1.getBoundingClientRect();
        var rect2 = element2.getBoundingClientRect();
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }

    function getRandomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    
    function generatePosition(element, otherElements) {
        var maxAttempts = 100;
        var attempts = 0;
        do {
            var overlap = false;
            element.style.top = Math.random() * (650 - element.offsetHeight) + 'px';
            element.style.left = Math.random() * (900 - element.offsetWidth) + 'px';
            for (var i = 0; i < otherElements.length; i++) {
                if (isOverlapping(element, otherElements[i])) {
                    overlap = true;
                    break;
                }
            }
            attempts++;
        } while (overlap && attempts < maxAttempts);
    }

    var allElements = [];
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].style.backgroundColor = getRandomColor();
        generatePosition(shapes[i], allElements);
        allElements.push(shapes[i]);
        generatePosition(holes[i], allElements);
        allElements.push(holes[i]);
        holes[i].setAttribute("draggable", "false");
    }

    var dragged;
    var matched = 0;
    var total = shapes.length;

    document.addEventListener("dragstart", function(event) {
        if (event.target.className === "hole") {
            event.preventDefault();
        } else {
            dragged = event.target;
            event.target.style.opacity = .5;
        }
    }, false);

    document.addEventListener("dragend", function(event) {
        event.target.style.opacity = "";
        var match = false;
        for (let i = 0; i < holes.length; i++) {
            var hole = holes[i].getBoundingClientRect();
            if (event.clientX >= hole.left && event.clientX <= hole.right && event.clientY >= hole.top && event.clientY <= hole.bottom) {
                if (holes[i].id === 'hole' + dragged.id.slice(-1)) {
                    match = true;
                    event.target.style.top = holes[i].style.top;
                    event.target.style.left = holes[i].style.left;
                    break;
                }
            }
        }
        if (match) {
            matched++;
        } else {
            generatePosition(event.target, allElements);
        }
        if (matched === total) {
            document.getElementById("modal").style.display = 'block';
        }
    }, false);

    document.getElementById("restart-button").onclick = function() {
        location.reload();
    }

    document.getElementById("main-page-button").onclick = function() {
        window.location.href = 'index.html';  // Измените этот URL на URL главной страницы вашего сайта
    }
}
