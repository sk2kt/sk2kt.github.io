const buttons = document.querySelectorAll('button');
buttons.forEach((button, index) => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // чтобы предотвратить немедленный переход по ссылке
    switch (index) {
      case 0:
        window.location.href = 'Difer/difer1.html';
        break;
      case 1:
        window.location.href = 'Difer/difer2.html';
        break;
      case 2:
        window.location.href = 'Difer/difer3.html';
        break;
      case 3:
        window.location.href = 'Difer/difer4.html';
        break;
      case 4:
        window.location.href = 'Difer/difer5.html';
        break;
      case 5:
        window.location.href = 'Difer/difer6.html';
        break;
      case 6:
        window.location.href = 'javascript:history.back()';
        break;
      default:
        break;
    }
  });
});
