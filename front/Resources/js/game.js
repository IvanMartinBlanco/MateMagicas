import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
  if (getSessionData()?.rol !== 'tutor' && getSessionData()?.rol !== 'alumno' && getSessionData()?.rol !== 'administrador') {
    // Redirigir a otra página
    window.location.replace("http://localhost/web/front/pages/login.html");
  }
  const gameSelector = document.getElementById("game-selector");
  const gameLevel = document.querySelector(".game-level");
  const gameLevels = {};
  const queryString = window.location.search;
  const userId=getSessionData().id;

  // Analizar la cadena de consulta para obtener los parámetros
  const params = new URLSearchParams(queryString);
  const stage = params.get('stage');
  const subject = params.get('subject');
  let currentScript = null;

  const levelNames = {
    1: "Fácil",
    2: "Medio",
    3: "Difícil"
  };

  const gameZone = document.querySelector(".game-zone");
  gameZone.innerHTML = "<h1>Elige el juego.</h1>";

  // Llamada al primer fetch
  fetch(`http://localhost/web/back/public/getworksbysubject?stage=${stage}&subject=${subject}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return response.json();
    })
    .then(data => {
      for (const gameName in data) {
        if (data.hasOwnProperty(gameName)) {
          const option = document.createElement("option");
          option.value = gameName;
          option.text = gameName;
          gameSelector.appendChild(option);

          // Almacenar los niveles disponibles de cada juego
          const levels = data[gameName].map(work => work.level);
          gameLevels[gameName] = levels.filter((level, index, arr) => arr.indexOf(level) === index);
        }
      }

      // Actualizar los niveles de dificultad al seleccionar un juego
      gameSelector?.addEventListener("change", () => {
        gameZone.innerHTML = "<h1>Elige el nivel.</h1>";
        const selectedGame = gameSelector.value;
        if (selectedGame) {
          const levels = gameLevels[selectedGame];
          gameLevel.innerHTML = "<label for='nivel'>Elige un nivel:</label>";
          levels.forEach(level => {
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "nivel";
            const ejercicios = data[selectedGame].filter(work => work.level === level);
            input.id = ejercicios[0].exerciseId;

            input.value = level;
            const label = document.createElement("label");
            label.textContent = levelNames[level];
            const div = document.createElement("div");
            div.appendChild(input);
            div.appendChild(label);

            // Agregar el atributo data-ejercicio al elemento in

            gameLevel.appendChild(div);
          });
        } else {
          gameLevel.innerHTML = "";
          gameZone.innerHTML = "<h1>Elige el juego.</h1>";
        }
      });

      gameLevel.addEventListener("change", () => {
        const selectedGame = gameSelector.value;
        const selectedLevel = document.querySelector("input[name=nivel]:checked")?.value;
        const selectedInput = window.event.target;
        const idEjercicio = selectedInput.getAttribute("id");

        if (selectedGame && selectedLevel) {
          const script = document.createElement("script");
          script.src = `../Resources/js/games/${idEjercicio}.js?id=${userId}`;
          script.setAttribute("data-level", selectedLevel); // Usamos el nivel seleccionado
          window.userId = userId;
          script.addEventListener("error", () => {
            gameZone.innerHTML = "<h1>El juego no está disponible</h1>";
          });
          gameZone.innerHTML = "";
          gameZone.appendChild(script);
          currentScript = script; // guarda el script cargado
        } else {
          gameZone.innerHTML = "<h1>Elige el juego.</h1>";
        }
      });
    })
});