// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Creamos un objeto vacío llamado "results".
results = {};

// Llamamos a la API con el método fetch() para obtener los datos necesarios para generar el juego.
fetch(`http://localhost/web/back/public/work?id=1`)
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
      results[i] = data[key];
      i++;
    }
    // Ordenadmos los números del objeto "results", y los usamos para generar el juego.
    num1 = Math.max(parseInt(results[0]), parseInt(results[1]));
    num1 -= Math.floor(Math.random() * 6);
    num2 = Math.max(parseInt(results[0]), parseInt(results[1]));
    num2 += Math.floor(Math.random() * 6);
    gameZone.innerHTML = `
      <h1>¿Qué números faltan entre ${num1} y ${num2}? Rellénalos con espacios entre los números.<span>(Si no hay ningún número deja el campo vacío)</span></h1>
      <h2>${num1} ... ${num2}</h2>
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
      // Evitamos que el formulario se envíe.
      event.preventDefault();

      // Obtenemos la respuesta del usuario y la limpiamos de espacios en blanco al principio y al final.
      userAnswer = document.getElementById("answer").value.trim();
      expectedNumbers = [];
      // Creamos una lista de los números esperados en la respuesta del usuario.
      for (let i = num1 + 1; i < num2; i++) {
        expectedNumbers.push(i.toString());
      }

      // Si el usuario no ha ingresado nada y los números son iguales, mostramos un mensaje de éxito en la pantalla y salimos de la función.
      if (userAnswer === "" && (num1 === num2 || num1 === num2 - 1)) {
        result(true);
        return;
      }

      // Convertimos la respuesta del usuario en una lista de cadenas y comparamos su longitud con la de los números esperados.
      userNumbers = userAnswer.split(" ");
      if (userNumbers.length !== expectedNumbers.length) {
        result(false, true);
        return;
      }

      // Comparamos cada número introducido por el usuario con los números esperados.
      for (let i = 0; i < userNumbers.length; i++) {
        if (userNumbers[i] !== expectedNumbers[i]) {
          result(false);
          return;
        }
      }

      // Si llegamos aquí, se envía el resultado de que todos los números son correctos.
      result(true);
    });
  })
  .catch(error => {
    console.error(error);
    serverMessage.textContent = "Error en la respuesta del servidor";
  });

// La función "result" muestra el mensaje de éxito o error en un modal y actualiza el resultado del usuario en la base de datos.
function result(success, amountExcess = null) {
  if (success) {
    modal.innerHTML = `
    <div class="modal-contenido">
    <h2>¡Éxito!</h2>
    <p>El resultado es correcto.</p>
    <button id="cerrarModal">Cerrar</button>
 </div>
  `;
  } else {
    if (amountExcess === null) {
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
    <p>La cantidad de números introducida es incorrecta.</p>
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
    'idEjercicio': 1,
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