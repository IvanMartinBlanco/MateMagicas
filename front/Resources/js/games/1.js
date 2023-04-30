gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");

const resultados = {};

// Llamada al primer fetch
fetch(`http://localhost/web/back/public/work?id=1`)
  .then(response => {
    if (!response.ok) {
      serverMessage.textContent = "Error en la respuesta del servidor";
    }
    return response.json();
  })
  .then(data => {
    let i = 0;
    for (let key in data) {
      resultados[i] = data[key];
      i++;
    }
    return resultados;
  })
  .then(resultados => {
    const num1 = Math.min(parseInt(resultados[0]), parseInt(resultados[1]));
    const num2 = Math.max(parseInt(resultados[0]), parseInt(resultados[1]));
  
    gameZone.innerHTML = `
      <h1>¿Qué números faltan entre ${num1} y ${num2}? Rellénalos con espacios entre los números.</h1>
      <h2>${num1} ... ${num2}</h2>
      <form id="answer-form">
        <label for="answer">Resultado:</label>
        <input type="text" name="answer" id="answer">
        <div id="button-container" class="button-container">
          <button type="submit">Comprobar</button>
        </div>
      </form>
    `;
  
    const answerForm = document.getElementById("answer-form");
    answerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Evita que el formulario se envíe
    
      const userAnswer = document.getElementById("answer").value;
      const expectedNumbers = [];
    
      if (userAnswer === "" && num1 === num2) { // Verifica si userAnswer es una cadena vacía y num1 y num2 son iguales
        modal.innerHTML=`
        <div class="modal-contenido">
        <h2>¡Éxito!</h2>
        <p>El resultado es correcto.</p>
        <button id="cerrarModal">Cerrar</button>
     </div>
      `;
      const miModal = document.getElementById("modal");
      miModal.style.display = "block";
        return;
      }
    
      for (let i = num1 + 1; i < num2; i++) {
        expectedNumbers.push(i.toString());
      }
    
      const userNumbers = userAnswer.split(" ");
    
      if (userNumbers.length !== expectedNumbers.length) {
        alert("El número de elementos no coincide");
        return;
      }
    
      for (let i = 0; i < userNumbers.length; i++) {
        if (userNumbers[i] !== expectedNumbers[i]) {
          alert("Respuesta incorrecta");
          return;
        }
      }
    
      modal.innerHTML=`
      <div class="modal-contenido">
      <h2>¡Éxito!</h2>
      <p>El resultado es correcto.</p>
      <button id="cerrarModal">Cerrar</button>
   </div>
    `;
    const miModal = document.getElementById("modal");
    miModal.style.display = "block";
      return;
    });

    const closeModal = document.getElementById("cerrarModal");
    closeModal.addEventListener("click", function () {
      const miModal = document.getElementById("modal");
      miModal.style.display = "none";
      
    });
  })
  .catch(error => {
    console.error(error);
    serverMessage.textContent = "Error en la respuesta del servidor";
  });
