// Obtener referencias a los elementos HTML necesarios
const gameZone = document.querySelector('.game-zone');
const modal = document.querySelector('.modal');
const userId = window.userId;

// Definir las medidas del rectángulo
const rectHeight = Math.floor(Math.random() * 10) + 1;
const rectWidth = Math.floor(Math.random() * 10) + 1;

// Crear el rectángulo
const rectangle = document.createElement('div');
rectangle.style.width = `${rectWidth * 20}px`;
rectangle.style.height = `${rectHeight * 20}px`;
rectangle.style.backgroundColor = 'lightblue';
rectangle.style.marginTop = `${50 - rectHeight * 5}px`;

// Crear la regla
const rule = document.createElement('div');
rule.style.width = `${rectWidth * 50}px`;
rule.style.height = '30px';
rule.style.position = 'relative';
rule.style.marginTop = '20px';

// Agregar las líneas verticales a la regla
for (let i = 0; i <= rectWidth; i++) {
  const line = document.createElement('div');
  line.style.width = '2px';
  line.style.height = '20px';
  line.style.position = 'absolute';
  line.style.left = `${i * 50}px`;
  line.style.borderLeft = 'solid 2px black';
  rule.appendChild(line);
}

// Calcular el número de rayas que cubre el rectángulo
const rayasCubiertas = Math.ceil(rectWidth * 20 / 50);

// Mostrar el rectángulo y la regla en pantalla
gameZone.innerHTML = `
  <h1>¿Cuánto mide?</h1>
  <div style="margin-top: 50px">
    ${rectangle.outerHTML}
    ${rule.outerHTML}
  </div>
  <form id="answer-form">
    <label for="answer-width">Número de rayas que cubre el rectángulo:</label>
    <input type="number" name="answer-width" id="answer-width" min="1">
    <br>
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;

// Manejar el envío del formulario
const answerForm = document.getElementById('answer-form');
answerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario se envíe
  const userWidth = parseInt(document.getElementById('answer-width').value);

  // Comprobar si la respuesta es correcta
  const success = userWidth === rayasCubiertas;
  result(success);
});

function result(success) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>Has acertado el área del rectángulo.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
  } else {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Error!</h2>
        <p>El área que has introducido es incorrecta.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
  }

  // Mostrar el modal
  const miModal = document.getElementById('modal');
  miModal.style.display = 'block';

  // Manejar el evento para cerrar el modal
  const closeModal = document.querySelector('#cerrarModal');
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    //location.reload();
  });
  
  // Enviar los datos del resultado al servidor
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