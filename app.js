document.addEventListener('DOMContentLoaded', () => {
  //variables globales
  const grid = document.querySelector('.grid');
  const flagsLeft = document.querySelector('#flags-left');
  const result = document.querySelector('#result');
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  //creacion del tablero
  function createBoard() {
    //array con valores 'bomb'
    const bombsArray = Array(bombAmount).fill('bomb');
    //array con valores 'valid'
    const emptyArray = Array(width * width - bombAmount).fill('valid');
    //array con valores de bombas y casillas validas
    const gameArray = bombsArray.concat(emptyArray);
    //array con los valores bomb y valid en oredenados al azar
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (var i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      //se agrega clase al los squares con el valor que posee el indice del shuffledArray
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //click normal
      square.addEventListener('click', function (e) {
        click(square);
      });

      //cntrol and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //agregar los numeros a los squares
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains('valid')) {
        //si el square a la izquierda es una bomba aumentar al total
        //prettier-ignore
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total++;
        //si el valor de i es mayor a 9, no esta en el borde derecho y el square que esta en la fila de arriba y la derecha contiene una bomba aumenta el valor del square
        //prettier-ignore
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
        //si el square arriba del actual posee una bomba aumenta el total
        //prettier-ignore
        if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
        //si el square arriba a la izquirda del actual aumentar el total
        //prettier-ignore
        if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
        //si el square a la derecha es una bomba aumentar el total
        //prettier-ignore
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
        //si el square en la fila de abajo y a la izquierda es una bomba aumentar el total
        //prettier-ignore
        if (i < 90 && !isLeftEdge && squares[i -1 + width].classList.contains('bomb')) total++;
        //si el square esta en la fila de abajo y a la derecha es una bomba aunmenta el total
        //prettier-ignore
        if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
        //si el square que esta abajo es una bomba aumentar el total
        //prettier-ignore
        if (i < 89 && squares[i + width].classList.contains('bomb')) total++;

        squares[i].setAttribute('data', total);
      }
    }
  }

  createBoard();

  //add Flag with con click derecho
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && flags < bombAmount) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = '🚩';
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    //prettier-ignore
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;
    if (square.classList.contains('bomb')) {
      //si el click es sobre una bomba se acaba el juego
      gameOver(square);
    } else {
      //Mostrar el valor del square
      let total = square.getAttribute('data');
      if (total != 0) {
        square.classList.add('checked');
        if (total == 1) square.classList.add('one');
        if (total == 2) square.classList.add('two');
        if (total == 3) square.classList.add('three');
        if (total == 4) square.classList.add('four');
        if (total == 5) square.classList.add('five');
        if (total == 6) square.classList.add('six');
        if (total == 7) square.classList.add('seven');
        if (total == 8) square.classList.add('eight');
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add('checked');
    checkForWin();
  }

  //revisar los squares vecinos
  function checkSquare(square, currentId) {
    let isLeftEdge = currentId % width === 0;
    let isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      //click en el square que esta a la izquierda
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //click en el square que esta arriba a la derecha
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //click en el square que esta arriba
      if (currentId > 9) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //click en el square que esta arriba a la izquierda
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //click en el square que esra a la derecha
      if (currentId < 99 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //click en el square que esta abajo a la derecha
      if (currentId < 89 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //clcik en el square queesta abajo
      if (currentId < 90) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      //click en el square que esta abajo a la izquierda
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 50);
  }

  //terminar juego
  function gameOver(square) {
    result.innerHTML = 'Game Over';
    isGameOver = true;
    //mostrr todas las bombas
    squares.forEach((square) => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣';
        square.classList.remove('bomb');
        square.classList.add('checked');
      }
    });
  }

  //revisar por victoria
  function checkForWin() {
    let matches = 0;
    let found = 0;

    squares.forEach((square) => {
      if (square.classList.contains('checked')) {
        found++;
      }
    });

    for (let i = 0; i < squares.length; i++) {
      //prettier-ignore
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++;
      }
      if (matches === bombAmount || found === 80) {
        result.innerHTML = 'WIN!';
        isGameOver = true;
      }
    }
  }

  //boton
  let bot = document.querySelector('.button');
  bot.addEventListener('click', function (e) {
    location.reload();
  });
});
