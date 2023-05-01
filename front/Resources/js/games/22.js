gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Generar vectores aleatorios
vectorA = [];
vectorB = [];
n = Math.floor(Math.random() * 5) + 2; // Tamaño de los vectores
for (i = 0; i < n; i++) {
    vectorA.push(Math.floor(Math.random() * 10) + 1); // Elementos aleatorios entre 1 y 10
    vectorB.push(Math.floor(Math.random() * 10) + 1);
}

// Definir la función
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

// Mostrar los vectores al usuario
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

answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que el formulario se envíe

    userResult = Number(document.getElementById("result").value.trim());

    if (isNaN(userResult)) {
        result(false, false);
        return;
    }

    if (userResult === productoPunto(vectorA, vectorB)) {
        result(true);
    } else {
        result(false);
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