gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Generar coeficiente y término aleatorios
coef = Math.floor(Math.random() * 10) + 1;
term = Math.floor(Math.random() * 10) + 1;

// Calcular solución
solution = term / coef;

// Mostrar la ecuación al usuario
gameZone.innerHTML = `
  <h1>Resuelve la siguiente ecuación:<span>(El resultado se espera en decimal con 2 decimales)</span></h1>
  <p>${coef}x = ${term}</p>
  <form id="answer-form">
    <label for="x">x = </label>
    <input type="text" name="x" id="x">
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;

answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  userX = Number(document.getElementById("x").value.trim());

  if (isNaN(userX)) {
    result(false, false);
    return;
  }

  if (Math.abs(userX - solution) < 0.01) {
    result(true);
  } else {
    result(false, true);
  }
});

function result(success, isDecimal = true) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>El resultado es correcto.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
  } else {
    if (isDecimal === true) {
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
          <p>No has introducido un número.</p>
          <button id="cerrarModal">Cerrar</button>
        </div>`;
    }
  }

  miModal = document.getElementById("modal");
  miModal.style.display = "block";
  closeModal = document.querySelector("#cerrarModal");
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    location.reload();
  });
  userResult = {
    'id': userId,
    'success': success ? 1 : 0,
    'idEjercicio': 16,
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