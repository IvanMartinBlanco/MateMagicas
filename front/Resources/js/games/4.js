

gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

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
randomRomanNumeral = romanNumerals[Math.floor(Math.random() * romanNumerals.length)];

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
// Manejar el envío del formulario
answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
    userAnswer = document.getElementById("answer").value.toUpperCase(); // Convertir la respuesta a mayúsculas para evitar errores

    // Convertir el número romano a decimal
    romanValues = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    };

    decimalValue = romanValues[randomRomanNumeral];

    userDecimalValue = parseInt(userAnswer);
    if (isNaN(userDecimalValue)) {
        result(false, false);
        return;
    }
    success = userDecimalValue === decimalValue;

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