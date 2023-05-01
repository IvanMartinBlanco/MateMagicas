gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

results = {};

// Llamada al primer fetch
fetch(`http://localhost/web/back/public/work?id=2`)
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
    num1 = Math.min(parseInt(results[0]), parseInt(results[1]));
    num1 -= Math.floor(Math.random() * 6);
    num2 = Math.max(parseInt(results[0]), parseInt(results[1]));
    num2 += Math.floor(Math.random() * 6);
    gameZone.innerHTML = `
      <h1>¿Qué números faltan entre ${num2} y ${num1}? Rellénalos con espacios entre los números.<span>(Si no hay ningún número deja el campo vacío)</span></h1>
      <h2>${num2} ... ${num1}</h2>
      <form id="answer-form">
        <label for="answer">Resultado:</label>
        <input type="number" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;
    answerForm = document.getElementById("answer-form");

    answerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Evita que el formulario se envíe
    
      userAnswer = document.getElementById("answer").value.trim();
      expectedNumbers = [];
    
      if (userAnswer === "" && (num1 === num2 || num1 + 1 === num2)) {
        result(true);
    
        return;
      }
    
      for (let i = num2 - 1; i > num1; i--) {
        expectedNumbers.push(i.toString());
      }
    
      userNumbers = userAnswer.split(" ");
    
      if (userNumbers.length !== expectedNumbers.length) {
        result(false, true);
        return;
      }
    
      for (let i = 0; i < userNumbers.length; i++) {
        if (userNumbers[i] !== expectedNumbers[i]) {
          result(false);
          return;
        }
      }
    
      result(true); // Mover aquí el llamado al método result() con el argumento true
      return;
    });
  })
    .catch(error => {
      console.error(error);
      serverMessage.textContent = "Error en la respuesta del servidor";
    });
    
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
        'idEjercicio': 2,
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