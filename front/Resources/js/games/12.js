gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

results = {};

fetch(`http://localhost/web/back/public/work?id=12`)
  .then(response => {
    if (!response.ok) {
      serverMessage.textContent = "Error en la respuesta del servidor";
    }
    return response.json();
  })
  .then(data => {
    let i = 0;
    for (let key in data) {
      results[i] = data[key];
      i++;
    }
    return results;
  })
  .then(results => {
    num1 = parseInt(results[0]);
    num1 += Math.floor(Math.random() * 5);
    num2 = parseInt(results[1]);
    num2 += Math.floor(Math.random() * 5);
    expectedResult = num1 - num2;
    gameZone.innerHTML = `
      <h1>¿Cuánto es ${num1} - ${num2}?</h1>
      <form id="answer-form">
        <label for="number">Resultado:</label>
        <input type="number" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;

    answerForm = document.getElementById("answer-form");
    answerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      userAnswer = parseInt(document.getElementById("answer").value.trim());
      if (isNaN(userAnswer)) {
        result(userAnswer, false);
        return;
      }

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

function result(success, isNumber=true) {
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
    'idEjercicio': 12,
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