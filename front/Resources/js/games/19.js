gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

do {
    hypotenuse = Math.floor(Math.random() * 20) + 1;
    hick = Math.floor(Math.random() * 10) + 1;
  } while (hypotenuse <= hick);

// Calcular el otro cateto
otherHick = Math.sqrt(hypotenuse**2 - hick**2);

gameZone.innerHTML = `
  <h1>¿Cuánto mide el cateto que falta?<span>(El resultado se espera en decimal con 2 decimales)</span></h1>
  <img class="figura" src="../Resources/images/games/triangulorectangulo.png" alt="Triángulo rectángulo">
  <p>Hipotenusa: ${hypotenuse}</p>
  <p>Cateto: ${hick}</p>
  <form id="answer-form">
    <label for="answer">Ingresa el valor del otro cateto:</label>
    <input type="text" name="answer" id="answer"><br>
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;
answerForm = document.getElementById("answer-form");

answerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que el formulario se envíe
  
    answerValue = Number(document.getElementById("answer").value.trim()).toFixed(2);
    if (isNaN(answerValue)) {
      result(false, false);
      return;
    }
      success = (Math.abs(answerValue - otherHick.toFixed(2)) <= 0.01);
    result(success);
  });

function result(success, isDecimal=true) {
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
      'idEjercicio': 19,
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