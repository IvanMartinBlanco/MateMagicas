// Obtener referencias a los elementos HTML necesarios
gameZone = document.querySelector('.game-zone');
modal = document.querySelector('.modal');
userId = window.userId;

// Definir las medidas del rectángulo
rectHeight = Math.floor(Math.random() * 1) + 1;
rectWidth = Math.floor(Math.random() * 5) + 1;

// Definir las medidas de la regla
ruleWidth = 500;
lineHeight = 50;
lineWidth = ruleWidth / 10;

// Crear el rectángulo
rectangle = document.createElement('div');
rectangle.style.width = `${rectWidth * lineWidth}px`;
rectangle.style.height = `${rectHeight * lineHeight}px`;
rectangle.style.backgroundColor = 'lightblue';
rectangle.style.position = 'absolute';
rectangle.style.top = `${lineHeight * -1}px`;
rectangle.style.left = `${lineWidth * 2}px`;

// Crear la regla
rule = document.createElement('div');
rule.style.width = `${ruleWidth}px`;
rule.style.height = `${lineHeight}px`;
rule.style.position = 'relative';
rule.style.borderTop = 'solid 2px black';

// Agregar las líneas verticales a la regla
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

// Mostrar el rectángulo y la regla en pantalla
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
  </form>
`;

// Manejar el envío del formulario
answerForm = document.getElementById('answer-form');
answerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
    userWidth = parseInt(document.getElementById('answer').value);
    if (isNaN(userWidth)) {
        result(false, false);
        return;
    }
    success = userWidth === rectWidth;
    result(success);
});

function result(success , isNumber = true) {
    if (success) {
        modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>Has acertado el área del rectángulo.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
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

    // Mostrar el modal
    miModal = document.getElementById('modal');
    miModal.style.display = 'block';

    // Manejar el evento para cerrar el modal
    closeModal = document.querySelector('#cerrarModal');
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