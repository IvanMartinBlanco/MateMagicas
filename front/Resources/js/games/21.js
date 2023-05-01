gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Generar matriz aleatoria
matriz = [];
n = Math.floor(Math.random() * 5) + 2; // Tamaño de la matriz
for (i = 0; i < n; i++) {
    matriz.push([]);
    for (j = 0; j < n; j++) {
        matriz[i].push(Math.floor(Math.random() * 5) + 1); // Elementos aleatorios entre 1 y 10
    }
}

// Definir la función
function det(matriz) {
    if (matriz.length == 2) {
        return matriz[0][0] * matriz[1][1] - matriz[0][1] * matriz[1][0];
    } else {
        determinante = 0;
        for (i = 0; i < matriz.length; i++) {
            submatriz = matriz.slice(1).map(fila => fila.filter((elem, j) => j != i));
            determinante += ((-1) ** i) * matriz[0][i] * det(submatriz);
        }
        return determinante;
    }
}

// Mostrar la matriz al usuario
matrizStr = "";
for (i = 0; i < n; i++) {
    matrizStr += matriz[i].join(" ") + "<br>";
}
gameZone.innerHTML = `
  <h1>Calcula el determinante de la siguiente matriz:</h1>
  <h2>${matrizStr}</h2>
  <form id="answer-form">
    <label for="result">Determinante = </label>
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

    if (Math.abs(userResult - det(matriz)) < 0.01) {
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
        'idEjercicio': 21,
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