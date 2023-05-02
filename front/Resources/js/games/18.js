gameZone = document.querySelector(".game-zone");
modal = document.querySelector(".modal");
userId = window.userId;

// Definir las figuras geométricas y sus áreas
figures = {
  triangle: { name: "Triángulo", formula: (base, height) => (base * height) / 2, image: "../Resources/images/games/triangulo.png" },
  square: { name: "Cuadrado", formula: (side) => side ** 2, image: "../Resources/images/games/cuadrado.png" },
  rectangle: { name: "Rectángulo", formula: (base, height) => base * height, image: "../Resources/images/games/rectangulo.png" }
};

// Seleccionar una figura aleatoria
figureKeys = Object.keys(figures);
selectedFigure = figures[figureKeys[Math.floor(Math.random() * figureKeys.length)]];

// Generar datos aleatorios para las dimensiones de la figura
base=null;
height=null;
 side=null; 
 area = null;
if (selectedFigure.name === "Triángulo") {
  base = Math.floor(Math.random() * 10) + 1;
  height = Math.floor(Math.random() * 10) + 1;
  area = selectedFigure.formula(base, height);
} else if (selectedFigure.name === "Cuadrado") {
  side = Math.floor(Math.random() * 10) + 1;
  area = selectedFigure.formula(side);
} else if (selectedFigure.name === "Rectángulo") {
  base = Math.floor(Math.random() * 10) + 1;
  height = Math.floor(Math.random() * 10) + 1;
  area = selectedFigure.formula(base, height);
}

if(selectedFigure.name === "Cuadrado"){
gameZone.innerHTML = `
  <h1>¿Cuál es el área de la siguiente figura?</h1>
  <img class="figura" src="${selectedFigure.image}" alt="${selectedFigure.name}">
  <p>Lado: ${side}</p>
  <form id="answer-form">
    <label for="answer">Ingresa el área:</label>
    <input type="number" name="answer" id="answer"><br>
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;}else{
    gameZone.innerHTML = `
  <h1>¿Cuál es el área de la siguiente figura?</h1>
  <img class="figura" src="${selectedFigure.image}" alt="${selectedFigure.name}">
  <p>Base: ${base}   Altura: ${height}</p>
  <form id="answer-form">
    <label for="answer">Ingresa el área:</label>
    <input type="number" name="answer" id="answer"><br>
    <div id="button-container" class="button-container">
      <button type="submit">Comprobar</button>
    </div>
  </form>
`;
}

answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  answerValue = Number(document.getElementById("answer").value.trim());
  if (isNaN(answerValue)) {
    result(false, false);
    return;
  }

  // Comprobar el resultado
  success = (answerValue === area);
  result(success);
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
      'idEjercicio': 18,
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