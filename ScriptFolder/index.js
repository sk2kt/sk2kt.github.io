const buttons = document.querySelectorAll('button');
buttons.forEach((button, index) => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // чтобы предотвратить немедленный переход по ссылке
    let game = '';
    switch (index) {
      case 0:
        game = 'tangram.html';
        fetch(`http://localhost:3000/visit/${game}`);
        // localStorage.setItem('visited', 'false');
        window.location.href = 'tangram.html';
        break;
      case 1:
        game = 'sort.html';
        fetch(`http://localhost:3000/visit/${game}`);
        // localStorage.setItem('visited', 'false');
        window.location.href = 'sort.html';
        break;
      case 2:
        game = 'create.html';
        fetch(`http://localhost:3000/visit/${game}`);
        // localStorage.setItem('visited', 'false');
        window.location.href = 'create.html';
        break;
      case 3:
        game = 'difer.html';
        fetch(`http://localhost:3000/visit/${game}`);
        // localStorage.setItem('visited', 'false');
        window.location.href = 'difer.html';
        break;
      case 4:
        game = 'lab.html';
        fetch(`http://localhost:3000/visit/${game}`);
        // localStorage.setItem('visited', 'false');
        window.location.href = 'lab.html';
        break;
      case 5:
        game = 'find.html';
        fetch(`http://localhost:3000/visit/${game}`);
        // localStorage.setItem('visited', 'false');
        window.location.href = 'find.html';
        break;
      default:
        break;
    }
  });
});

// Создаем объект Audio для каждого звука
const sounds = {
  game1: new Audio('Voicing/1.mp3'),
  game2: new Audio('Voicing/2.mp3'),
  game3: new Audio('Voicing/3.mp3'),
  game4: new Audio('Voicing/4.mp3'),
  game5: new Audio('Voicing/5.mp3'),
  game6: new Audio('Voicing/6.mp3')
};

// Переменная для хранения текущего звука
let currentSound;

function playSound(game) {
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }

  const sound = sounds[game];

  sound.play();

  currentSound = sound;
}

// Обработчик события ухода курсора с элемента
function stopSound() {
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
    currentSound = null;
  }
}

// Добавляем обработчики событий наведения и ухода курсора на каждый элемент
const games = document.querySelectorAll('.game');
games.forEach(game => {
  const button = game.querySelector('button');
  const gameName = button.getAttribute('data-sound');
  game.addEventListener('mouseenter', () => playSound(gameName));
  game.addEventListener('mouseleave', stopSound);
});
