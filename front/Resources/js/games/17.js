gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Generar coeficiente y término aleatorios
a = Math.floor(Math.random() * 10) + 1;
b = Math.floor(Math.random() * 10) + 1;
x = Math.floor(Math.random() * 10) + 1;

// Definir la función
function f(x) {
  return a * x + b;
}

// Mostrar la función al usuario
gameZone.innerHTML = `
  <h1>Evalúa la siguiente función:<span>(El resultado se espera en decimal con 2 decimales)</span></h1>
  <p>f(x) = ${a}x + ${b}</p>
  <form id="answer-form">
    <label for="result">f(${x}) = </label>
    <input type="text" name="result" id="result">
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;

answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  userResult = Number(document.getElementById("result").value.trim());

  if (isNaN(userResult)) {
    result(false, false);
    return;
  }

  if (Math.abs(f(x) - userResult) < 0.01) {
    result(true);
  } else {
    result(false);
  }
});


function result(success, isDecimal=true) {
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
      'idEjercicio': 17,
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