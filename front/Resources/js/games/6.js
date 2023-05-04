// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector('.game-zone');
modal = document.querySelector('.modal');
userId = window.userId;

// Elegimos las figuras disponibles para el juego y seleccionamos una de forma aleatoria.
figures = [
  {
    name: 'círculo',
    src: '../Resources/images/games/circulo.png'
  },
  {
    name: 'triángulo',
    src: '../Resources/images/games/triangulo.png'
  },
  {
    name: 'rectángulo',
    src: '../Resources/images/games/rectangulo.png'
  },
  {
    name: 'cuadrado',
    src: '../Resources/images/games/cuadrado.png'
  }
];
randomFigure = figures[Math.floor(Math.random() * figures.length)];

//Usamos la figura para generar el juego.
gameZone.innerHTML = `
  <h1>¿Qué figura es?</h1>
  <img class="figura" src="${randomFigure.src}" alt="Figura misteriosa">
  <form id="answer-form">
    <label for="answer">Nombre de la figura:</label>
    <input type="text" name="answer" id="answer">
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>`;

// Agregamos un event listener al formulario que se activa cuando se envía el formulario.
answerForm = document.getElementById('answer-form');
answerForm.addEventListener('submit', (event) => {
  // Evitar que el formulario se envíe.
  event.preventDefault();

  // Obtenemos la respuesta del usuario, la ponemos en minúsculas y la limpiamos de espacios en blanco al principio y al final.
  userAnswer = document.getElementById('answer').value.toLowerCase().trim();

  // Comparamos el valor introducido por el usuario con el valor esperado.
  success = userAnswer === randomFigure.name;

  // Se envía el resultado.  
  result(success);
});

// La función "result" muestra el mensaje de éxito o error en un modal y actualiza el resultado del usuario en la base de datos.
function result(success) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>Has acertado la figura.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>`;
  } else {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Error!</h2>
        <p>La respuesta es incorrecta.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>`;
  }
  // Mostramos el modal y recargamos la página cuando se cierra.
  miModal = document.getElementById('modal');
  miModal.style.display = 'block';
  closeModal = document.querySelector('#cerrarModal');
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    location.reload();
  });
  // Actualizamos el resultado del usuario en la base de datos.
  userResult = {
    id: userId,
    success: success ? 1 : 0,
    idEjercicio: 6
  };
  fetch("http://localhost/web/back/public/editresult", {
    method: 'PUT',
    body: JSON.stringify(userResult)
  })
    .then(response => response.json())
    .catch((error) => {
      console.log(error)
      alert('Ha ocurrido un error al modificar el resultado');
    });
}