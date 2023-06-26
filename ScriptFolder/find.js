window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 700;
    canvas.height = 700;
  
    const objectsToFindDiv = document.getElementById("objectsToFind");
    
  
    const images = Array(20)
      .fill()
      .map((_, i) => {
        const img = new Image();
        img.src = `Images/find/image${i + 1}.png`;
        img.id = `image${i + 1}`;
        img.onload = () => drawRandom(img);
        return img;
      });
  
    const imagesPositions = [];
  
    function drawRandom(img) {
        let attempts = 0;
        while (true) {
          attempts++;
          const randomWidth = Math.random() * (200 - 50) + 50;
          const aspectRatio = img.width / img.height;
          const randomHeight = randomWidth / aspectRatio;
          const randomX = Math.random() * (canvas.width - randomWidth);
          const randomY = Math.random() * (canvas.height - randomHeight);
      
          const newImagePos = { img, x: randomX, y: randomY, width: randomWidth, height: randomHeight };
      
          if (imagesPositions.every(existingImagePos => !isOverlappingTooMuch(newImagePos, existingImagePos))) {
            ctx.drawImage(img, randomX, randomY, randomWidth, randomHeight);
            imagesPositions.push(newImagePos);
            break;
          } else if (attempts > 1000) {
            // Too many attempts to place the image, aborting to avoid infinite loop
            console.error('Could not place image after 1000 attempts, aborting');
            break;
          }
        }
      }
      
  
    let objectsToFind = [];
    let foundObjects = 0;
  
    function generateObjectsToFind() {
      objectsToFind = [...images]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      objectsToFindDiv.innerHTML = "";
      objectsToFind.forEach(img => {
        const imgElement = document.createElement("img");
        imgElement.src = img.src;
        imgElement.classList.add("objectToFind");
        objectsToFindDiv.appendChild(imgElement);
      });
    }
  
    function checkIfObjectFound(x, y) {
        for (let index = 0; index < imagesPositions.length; index++) {
          const { img, x: imgX, y: imgY, width, height } = imagesPositions[index];
          if (
            x > imgX &&
            x < imgX + width &&
            y > imgY &&
            y < imgY + height &&
            objectsToFind.includes(img)
          ) {
            const objectToFindIndex = objectsToFind.indexOf(img);
            objectsToFind.splice(objectToFindIndex, 1);
            document.querySelector(`.objectToFind[src="${img.src}"]`).style.opacity = "0.5";
            imagesPositions.splice(index, 1);
            redrawCanvas();
            foundObjects++;
            if (foundObjects === 5) {
              const sound = new Audio('./Voicing/modal.mp3');
              sound.play();
              document.getElementById("modal").style.display = 'block';
            }
            break; // прерываем цикл после нахождения предмета
          }
        }
    }
    document.getElementById("restart-button").onclick = function() {
      location.reload();
    }

    document.getElementById("main-page-button").onclick = function() {
      window.location.href = 'index.html';
    }

    function isOverlappingTooMuch(newImagePos, existingImagePos) {
        const rect1 = {
          left: newImagePos.x,
          right: newImagePos.x + newImagePos.width,
          top: newImagePos.y,
          bottom: newImagePos.y + newImagePos.height
        };
      
        const rect2 = {
          left: existingImagePos.x,
          right: existingImagePos.x + existingImagePos.width,
          top: existingImagePos.y,
          bottom: existingImagePos.y + existingImagePos.height
        };
      
        const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
        const overlapArea = xOverlap * yOverlap;
      
        const newImageArea = newImagePos.width * newImagePos.height;
        const existingImageArea = existingImagePos.width * existingImagePos.height;
      
        return (overlapArea / newImageArea > 0.5) || (overlapArea / existingImageArea > 0.5);
      }
    
    
      function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        imagesPositions.forEach(imgPos => {
          const { img, x, y, width, height } = imgPos;
          ctx.drawImage(img, x, y, width, height);
        });
      }
    
  
      canvas.onclick = function(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        checkIfObjectFound(x, y);
    };
    
  
    generateObjectsToFind();
  };
  