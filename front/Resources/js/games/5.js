gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Definir los números romanos y la operación a realizar
romanToDecimal = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000
};
romanNumerals = ["I", "V", "X", "L", "C", "D", "M"];
randomRomanNumeral1 = romanNumerals[Math.floor(Math.random() * romanNumerals.length)];
randomRomanNumeral2 = romanNumerals[Math.floor(Math.random() * romanNumerals.length)];
operation = Math.random() < 0.5 ? "sumar" : "restar";

// Calcular el resultado de la operación
decimalValue1 = romanToDecimal[randomRomanNumeral1];
decimalValue2 = romanToDecimal[randomRomanNumeral2];
expectedResult = operation === "sumar" ? decimalValue1 + decimalValue2 : decimalValue1 - decimalValue2;

// Mostrar la información en la pantalla
gameZone.innerHTML = `
      <h1>Sabiendo que es un número romano, ${operation} ${randomRomanNumeral1} y ${randomRomanNumeral2}, ¿qué número representa el resultado?</h1>
      <h2>${randomRomanNumeral1} ${operation === "sumar" ? "+" : "-"} ${randomRomanNumeral2}</h2>
      <form id="answer-form">
        <label for="answer">Resultado:</label>
        <input type="text" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;

// Manejar el envío del formulario
answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
    userAnswer = document.getElementById("answer").value.toUpperCase(); // Convertir la respuesta a mayúsculas para evitar errores

    // Convertir la respuesta a un número entero
    userDecimalValue = parseInt(userAnswer);
    if (isNaN(userDecimalValue)) {
        result(false, false);
        return;
    }

    // Comprobar si la respuesta es correcta
    success = userDecimalValue === expectedResult;
    result(success);
    return;
});

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
        'idEjercicio': 5,
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