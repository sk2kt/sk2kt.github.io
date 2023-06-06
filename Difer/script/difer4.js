let differencesFound = 0;
const totalDifferences = document.getElementsByClassName('difference').length;
document.getElementById("restart-button").onclick = function() {
    location.reload();
}

document.getElementById("main-page-button").onclick = function() {
    location.href = '../difer.html';
}

const differences = document.getElementsByClassName('difference');
for (let i = 0; i < differences.length; i++) {
    differences[i].addEventListener('click', function(event) {
        event.preventDefault();
        if (!this.classList.contains('found')) {
            this.style.visibility = 'hidden';
            this.classList.add('found');
            differencesFound++;

            // Создание красного кружка
            const redCircle = document.createElement('div');
            redCircle.classList.add('red-circle');

            // Позиционирование красного кружка в позиции курсора
            const clickX = event.clientX;
            const clickY = event.clientY;
            redCircle.style.left = clickX + - 15 + 'px';
            redCircle.style.top = clickY + -15 + 'px';

            // Добавление красного кружка на страницу
            document.body.appendChild(redCircle);

            if (differencesFound === totalDifferences) {
                document.getElementById("modal").style.display = 'block';
            }
        }
    });
}
