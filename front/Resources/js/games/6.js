// Obtener referencias a los elementos HTML necesarios
gameZone = document.querySelector('.game-zone');
modal = document.querySelector('.modal');
userId = window.userId;

// Definir los datos de las figuras
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

// Seleccionar una figura aleatoria
randomFigure = figures[Math.floor(Math.random() * figures.length)];

// Mostrar la figura en pantalla
gameZone.innerHTML = `
  <h1>¿Qué figura es?</h1>
  <img class="figura" src="${randomFigure.src}" alt="Figura misteriosa">
  <form id="answer-form">
    <label for="answer">Nombre de la figura:</label>
    <input type="text" name="answer" id="answer">
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;

// Manejar el envío del formulario
answerForm = document.getElementById('answer-form');
answerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario se envíe
  userAnswer = document.getElementById('answer').value.toLowerCase(); // Convertir la respuesta a minúsculas para evitar errores

  // Comprobar si la respuesta es correcta
  success = userAnswer === randomFigure.name;
  result(success);
});

// Función para mostrar el resultado en pantalla
function result(success) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>Has acertado la figura.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
  } else {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Error!</h2>
        <p>La respuesta es incorrecta.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
  }

  // Mostrar el modal
  miModal = document.getElementById('modal');
  miModal.style.display = 'block';

  // Manejar el evento para cerrar el modal
  closeModal = document.querySelector('#cerrarModal');
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    location.reload();
  });

  // Enviar los datos del resultado al servidor
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