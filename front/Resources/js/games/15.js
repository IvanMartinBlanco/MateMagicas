// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Creamos un objeto vacío llamado "results".
expectedResult = {};

// Llamamos a la API con el método fetch() para obtener los datos necesarios para generar el juego.
fetch(`http://localhost/web/back/public/work?id=11`)
  .then(response => {
    // Si la respuesta no es válida, muestra un mensaje de error en la pantalla.
    if (!response.ok) {
      serverMessage.textContent = "Error en la respuesta del servidor";
    }
    // Convertimos la respuesta en formato JSON.
    return response.json();
  })
  .then(data => {
    // Iteramos sobre los datos obtenidos de la API y los agregamos al objeto "results".
    let i = 0;
    for (let key in data) {
      expectedResult[i] = data[key];
      i++;
    }
    return expectedResult;
  })
  .then(results => {
    // Preparamos los números del objeto "results".
    num1 = Math.floor(Math.random() * parseInt(results[0])) + 1;
    num2 = Math.floor(Math.random() * parseInt(results[1])) + 1;
    exp1 = Math.floor(Math.random() * 3) + 1;
    exp2 = Math.floor(Math.random() * 3) + 1;
    let expectedResult = Math.pow(num1, exp1) + Math.pow(num2, exp2);
    gameZone.innerHTML = `
      <h1>¿Cuánto es ${num1} elevado a la ${exp1} sumado a ${num2} elevado a la ${exp2}?</h1>
      <form id="answer-form">
        <label for="number">Resultado:</label>
        <input type="number" step="0.01" name="answer" id="answer">
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
      userAnswer = parseFloat(document.getElementById("answer").value.trim());
      // Si el usuario ha ingresado algo que no es un número, mostramos un mensaje de error en la pantalla y salimos de la función.
      if (isNaN(userAnswer)) {
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
  })
  .catch(error => {
    console.error(error);
    serverMessage.textContent = "Error en la respuesta del servidor";
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
    'idEjercicio': 15,
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