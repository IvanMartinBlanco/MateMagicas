// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Generamos datos aleatorios para las dimensiones del triángulo, ajustando con un bucle para que no sean erróneos y los usamos para generar el juego.
do {
  hypotenuse = Math.floor(Math.random() * 20) + 1;
  hick = Math.floor(Math.random() * 10) + 1;
} while (hypotenuse <= hick);
otherHick = Math.sqrt(hypotenuse ** 2 - hick ** 2);
gameZone.innerHTML = `
  <h1>¿Cuánto mide el cateto que falta?<span>(El resultado se espera en decimal con 2 decimales)</span></h1>
  <img class="figura" src="../Resources/images/games/triangulorectangulo.png" alt="Triángulo rectángulo">
  <p>Hipotenusa: ${hypotenuse}</p>
  <p>Cateto: ${hick}</p>
  <form id="answer-form">
    <label for="answer">Ingresa el valor del otro cateto:</label>
    <input type="text" name="answer" id="answer"><br>
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>`;
// Agregamos un event listener al formulario que se activa cuando se envía el formulario.
answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
  // Evita que el formulario se envíe.
  event.preventDefault();

  // Obtenemos la respuesta del usuario y la limpiamos de espacios en blanco al principio y al final.
  answerValue = Number(document.getElementById("answer").value.trim()).toFixed(2);

  // Si el usuario ha ingresado algo que no es un número, mostramos un mensaje de error en la pantalla y salimos de la función.
  if (isNaN(answerValue)) {
    result(false, false);
    return;
  }

  // Comparamos el valor introducido por el usuario con el esperado y se envía el resultado.
  success = (Math.abs(answerValue - otherHick.toFixed(2)) <= 0.01);
  result(success);
});
// La función "result" muestra el mensaje de éxito o error en un modal y actualiza el resultado del usuario en la base de datos.
function result(success, isDecimal = true) {
  if (success) {
    modal.innerHTML = `
        <div class="modal-contenido">
          <h2>¡Éxito!</h2>
          <p>El resultado es correcto.</p>
          <button id="cerrarModal">Cerrar</button>
        </div>`;
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
    'idEjercicio': 19,
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