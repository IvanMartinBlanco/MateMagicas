gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

results = {};

// Llamada al primer fetch
fetch(`http://localhost/web/back/public/work?id=11`)
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
    num1 = Math.floor(Math.random() * parseInt(results[0])) + 1;
    num2 = Math.floor(Math.random() * parseInt(results[1])) + 1;
    decimal1 = parseFloat((Math.random() * 10).toFixed(2));
    decimal2 = parseFloat((Math.random() * 10).toFixed(2));
    let sum = parseFloat((decimal1 + decimal2).toFixed(2));
    let expectedResult = sum;
    
    gameZone.innerHTML = `
      <h1>¿Cuánto es ${decimal1} + ${decimal2}?<span>(El resultado se espera en decimal con 2 decimales)</span></h1>
      <form id="answer-form">
        <label for="number">Resultado:</label>
        <input type="number" step="0.01" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;

    answerForm = document.getElementById("answer-form");
    answerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Evita que el formulario se envíe

      userAnswer = parseFloat(document.getElementById("answer").value.trim());
      if (isNaN(userAnswer)) {
        result(false, false);
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
          <p>No has introducido un número decimal.</p>
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
    'idEjercicio': 11,
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