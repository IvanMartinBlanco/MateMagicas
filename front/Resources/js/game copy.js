import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
  if (getSessionData()?.rol !== 'tutor' && getSessionData()?.rol !== 'alumno' && getSessionData()?.rol !== 'administrador') {
    // Redirigir a otra página
    window.location.replace("../../../front/pages/login.html");
  }
  const gameSelector = document.getElementById("game-selector");
  const gameLevel = document.querySelector(".game-level");
  const gameLevels = {};
  const queryString = window.location.search;

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
      Object.keys(data).forEach(gameName => {
        const option = document.createElement("option");
        option.value = gameName;
        option.text = gameName;
        gameSelector.add(option);

        // Obtener el array de niveles para el juego actual
        const levels = data[gameName];
        // Asignar un valor específico a cada nivel usando el índice
        // 0 -> fácil, 1 -> medio, 2 -> difícil
        gameLevels[gameName] = {};
        levels.forEach(levelObj => {
          const level = Object.keys(levelObj)[0];
          const levelId = levelObj[level];
          gameLevels[gameName][level] = levelId;
        });
      });

      // Actualizar los niveles de dificultad al seleccionar un juego
      gameSelector?.addEventListener("change", () => {
        gameZone.innerHTML = "<h1>Elige el nivel.</h1>";
        const selectedGame = gameSelector.value;
        if (selectedGame) {
          const levels = gameLevels[selectedGame];
          console.log(selectedGame)
          gameLevel.innerHTML = "<label for='nivel'>Elige un nivel:</label>";
          Object.keys(levels).forEach(level => {
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "nivel";
            input.value = level;
            const label = document.createElement("label");
            label.textContent = levelNames[levels[level]];
            const div = document.createElement("div");
            div.appendChild(input);
            div.appendChild(label);
            gameLevel.appendChild(div);
          });
        } else {
          gameLevel.innerHTML = "";
          gameZone.innerHTML = "<h1>Elige el juego.</h1>";
        }
      });

      gameLevel.addEventListener("change", () => {
        currentScript?.parentNode?.removeChild(currentScript);
        currentScript = null;

        const selectedGame = gameSelector.value;
        const selectedLevel = document.querySelector("input[name=nivel]:checked")?.value;

        if (selectedGame && selectedLevel) {
          const selectedId = gameLevels[selectedGame][selectedLevel]; // Obtenemos el ID del juego según el nivel seleccionado
          const script = document.createElement("script");
          script.src = `../Resources/js/games/${selectedId}.js`;
          script.setAttribute("data-level", selectedLevel); // Usamos el nivel seleccionado
          gameZone.innerHTML = "";
          gameZone.appendChild(script);
          currentScript = script; // guarda el script cargado
        } else {
          gameZone.innerHTML = "<h1>Elige el juego.</h1>";
        }
      });
    })
});