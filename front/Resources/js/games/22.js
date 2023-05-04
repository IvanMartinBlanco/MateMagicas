// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Creamos dos array vacíos para representar los vectores.
vectorA = [];
vectorB = [];

// Preparamos los números aleatorios del ejercicio y los usamos para generar el juego.
n = Math.floor(Math.random() * 5) + 2;
for (i = 0; i < n; i++) {
  vectorA.push(Math.floor(Math.random() * 10) + 1);
  vectorB.push(Math.floor(Math.random() * 10) + 1);
}
function productoPunto(vectorA, vectorB) {
  if (vectorA.length != vectorB.length) {
    return null;
  }
  producto = 0;
  for (i = 0; i < vectorA.length; i++) {
    producto += vectorA[i] * vectorB[i];
  }
  return producto;
}
vectorAStr = vectorA.join(" ");
vectorBStr = vectorB.join(" ");
gameZone.innerHTML = `
  <h1>Calcula el producto punto de los siguientes vectores:</h1>
  <h2>${vectorAStr}</h2>
  <h2>${vectorBStr}</h2>
  <form id="answer-form">
    <label for="result">Producto punto = </label>
    <input type="text" name="result" id="result">
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
  userResult = Number(document.getElementById("result").value.trim());

  // Si el usuario ha ingresado algo que no es un número, mostramos un mensaje de error en la pantalla y salimos de la función.
  if (isNaN(userResult)) {
    result(false, false);
    return;
  }

  // Comparamos el valor introducido por el usuario con el esperado y se envía el resultado.
  if (userResult === productoPunto(vectorA, vectorB)) {
    result(true);
  } else {
    result(false);
  }
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
    'idEjercicio': 22,
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