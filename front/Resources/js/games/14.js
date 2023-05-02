gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;




    num1 = Math.floor(Math.random() * 5) + 1;
    num2 = Math.floor(Math.random() * 5) + 1;
    denom1 = Math.floor(Math.random() * 5) + 1;
    denom2 = Math.floor(Math.random() * 5) + 1;
    let commonDenominator = denom1 * denom2;
    let sum = (num1 * denom2) + (num2 * denom1);
    let expectedResult = `${sum}/${commonDenominator}`;
    
    gameZone.innerHTML = `
      <h1>¿Cuánto es ${num1}/${denom1} + ${num2}/${denom2}?<span>(El resultado se espera en fracción con el MCM)</span></h1>
      <form id="answer-form">
        <label for="number">Resultado:</label>
        <input type="text" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;

    answerForm = document.getElementById("answer-form");
    answerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Evita que el formulario se envíe

      userAnswer = document.getElementById("answer").value.trim();
      if (!/^\d+\/\d+$/.test(userAnswer)) {
        result(false, false);
        return;
      }
      
      if (userAnswer === expectedResult) {
        result(true);
      } else {
        result(false);
      }
    });


function result(success, isFrac=true) {
  if (success) {
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>El resultado es correcto.</p>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;
  } else {
    if (isFrac === true) {
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
          <p>No has introducido una fracción.</p>
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
    'idEjercicio': 14,
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