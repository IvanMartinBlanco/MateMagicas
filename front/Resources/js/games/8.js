// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector('.game-zone');
modal = document.querySelector('.modal');
userId = window.userId;

// Definimos las medidas del rectángulo.
rectHeight = Math.floor(Math.random() * 1) + 1;
rectWidth = Math.floor(Math.random() * 5) + 1;

// Definimos las medidas de la regla.
ruleWidth = 500;
lineHeight = 50;
lineWidth = ruleWidth / 10;

// Creamos el rectángulo.
rectangle = document.createElement('div');
rectangle.style.width = `${rectWidth * lineWidth}px`;
rectangle.style.height = `${rectHeight * lineHeight}px`;
rectangle.style.backgroundColor = 'lightblue';
rectangle.style.position = 'absolute';
rectangle.style.top = `${lineHeight * -1}px`;
rectangle.style.left = `${lineWidth * 2}px`;

// Creamos la regla.
rule = document.createElement('div');
rule.style.width = `${ruleWidth}px`;
rule.style.height = `${lineHeight}px`;
rule.style.position = 'relative';
rule.style.borderTop = 'solid 2px black';

// Añadimos las líneas de medida en la regla.
for (let i = 0; i < 10; i++) {
  line = document.createElement('div');
  line.style.width = `${lineWidth}px`;
  line.style.height = `${lineHeight}px`;
  line.style.position = 'absolute';
  line.style.top = `0`;
  line.style.left = `${i * lineWidth}px`;
  line.style.borderLeft = 'solid 2px black';
  rule.appendChild(line);
}

//Usamos el rectángulo y la regla para generar el juego.
gameZone.innerHTML = `
  <h1>¿Cuánto mide?</h1>
  <div style="margin-top: ${lineHeight * 3}px; position: relative;">
  ${rectangle.outerHTML}
    ${rule.outerHTML}
  </div>
  <form id="answer-form">
    <input type="number" name="answer" id="answer" min="1">
    <br>
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>`;

// Agregamos un event listener al formulario que se activa cuando se envía el formulario.
answerForm = document.getElementById('answer-form');
answerForm.addEventListener('submit', (event) => {
  // Evitar que el formulario se envíe  
  event.preventDefault();

  // Obtenemos la respuesta del usuario y la limpiamos de espacios en blanco al principio y al final.
  userWidth = parseInt(document.getElementById('answer').value.trim());

  // Si el usuario ha ingresado algo que no es un número, mostramos un mensaje de error en la pantalla y salimos de la función.
  if (isNaN(userWidth)) {
    result(false, false);
    return;
  }

  // Comparamos el valor introducido por el usuario con el valor esperado.
  success = userWidth === rectWidth;

  // Se envía el resultado.
  result(success);
});

// La función "result" muestra el mensaje de éxito o error en un modal y actualiza el resultado del usuario en la base de datos.
function result(success, isNumber = true) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>Has acertado el área del rectángulo.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>`;
  } else {
    if (isNumber === true) {
      modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Error!</h2>
        <p>El resultado es incorrecto.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>`;
    } else {
      modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Error!</h2>
        <p>No se ha introducido un número.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>`;
    }
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
    idEjercicio: 8
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