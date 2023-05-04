// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Preparamos los números aleatorios del ejercicio y los usamos para generar el juego.
num1 = Math.floor(Math.random() * 5) + 1;
num2 = Math.floor(Math.random() * 5) + 1;
denom1 = Math.floor(Math.random() * 5) + 1;
denom2 = Math.floor(Math.random() * 5) + 1;
let commonDenominator = denom1 * denom2;
let sum = (num1 * denom2) + (num2 * denom1);
let expectedResult = `${sum}/${commonDenominator}`;
gameZone.innerHTML = `
      <h1>¿Cuánto es ${num1}/${denom1} + ${num2}/${denom2}?<span>(El resultado se espera en fracción con el MCM)</span></h1>
      <form id="answer-form">
        <label for="number">Resultado:</label>
        <input type="text" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;
// Agregamos un event listener al formulario que se activa cuando se envía el formulario.
answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
  // Evita que el formulario se envíe.
  event.preventDefault();

  // Obtenemos la respuesta del usuario y la limpiamos de espacios en blanco al principio y al final.
  userAnswer = document.getElementById("answer").value.trim();

  // Si el usuario ha ingresado algo que no es una fracción, mostramos un mensaje de error en la pantalla y salimos de la función.
  if (!/^\d+\/\d+$/.test(userAnswer)) {
    result(false, false);
    return;
  }

  // Comparamos el valor introducido por el usuario con el esperado y se envía el resultado.
  if (userAnswer === expectedResult) {
    result(true);
  } else {
    result(false);
  }
});
// La función "result" muestra el mensaje de éxito o error en un modal y actualiza el resultado del usuario en la base de datos.
function result(success, isFrac = true) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>El resultado es correcto.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>`;
  } else {
    if (isFrac === true) {
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
          <p>No has introducido una fracción.</p>
          <button id="cerrarModal">Cerrar</button>
        </div>`;
    }
  }
  // Mostramos el modal y recargamos la página cuando se cierra.
  miModal = document.getElementById("modal");
  miModal.style.display = "block";
  closeModal = document.querySelector("#cerrarModal");
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    location.reload();
  });
  // Actualizamos el resultado del usuario en la base de datos.
  userResult = {
    'id': userId,
    'success': success ? 1 : 0,
    'idEjercicio': 14,
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