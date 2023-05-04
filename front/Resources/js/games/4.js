// Seleccionamos los elementos del DOM con la clase "game-zone" y "modal", y asignamos el valor de la variable global "userId" al identificador de usuario.
gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Definimos la tabla de conversión de números romanos a decimales.
romanToDecimal = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000
};
// Elegimos los números romanos disponibles para el juego y seleccionamos uno de forma aleatoria.
romanNumerals = ["I", "V", "X", "L", "C", "D", "M"];
randomRomanNumeral = romanNumerals[Math.floor(Math.random() * romanNumerals.length)];
//Usamos el número para generar el juego.
gameZone.innerHTML = `
      <h1>Sabiendo que es un número romano, ¿qué número representa ${randomRomanNumeral}?</h1>
      <h2>${randomRomanNumeral}</h2>
      <form id="answer-form">
        <label for="answer">Resultado:</label>
        <input type="number" name="answer" id="answer">
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
    // Obtenemos el valor decimal que tiene el número romano que salió aleatoriamente.
    decimalValue = romanToDecimal[randomRomanNumeral];

    // Si el usuario ha ingresado algo que no es un número, mostramos un mensaje de error en la pantalla y salimos de la función.
    userDecimalValue = parseInt(userAnswer);
    if (isNaN(userDecimalValue)) {
        result(false, false);
        return;
    }

    // Comparamos el valor introducido por el usuario con el valor esperado.
    success = userDecimalValue === decimalValue;

    // Se envía el resultado.
    result(success);
});
// La función "result" muestra el mensaje de éxito o error en un modal y actualiza el resultado del usuario en la base de datos.
function result(success, isNumber = true) {
    if (success) {
        modal.innerHTML = `
      <div class="modal-contenido">
      <h2>¡Éxito!</h2>
      <p>El resultado es correcto.</p>
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
        'idEjercicio': 4,
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