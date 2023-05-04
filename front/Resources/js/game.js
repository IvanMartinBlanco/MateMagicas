import { getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
  // Verificamos si el usuario tiene rol de "tutor", "alumno" o "administrador" al cargar la página.
  if (getSessionData()?.rol !== 'tutor' && getSessionData()?.rol !== 'alumno' && getSessionData()?.rol !== 'administrador') {
    // Redirigimos a otra página.
    window.location.replace("http://localhost/web/front/pages/login.html");
  }
  // Obtenemos elementos del formulario y otras secciones.
  const gameSelector = document.getElementById("game-selector");
  const gameLevel = document.querySelector(".game-level");
  const gameLevels = {};
  const queryString = window.location.search;
  const userId = getSessionData().id;
  const params = new URLSearchParams(queryString);
  const stage = params.get('stage');
  const subject = params.get('subject');
  const levelNames = {
    1: "Fácil",
    2: "Medio",
    3: "Difícil"
  };
  const gameZone = document.querySelector(".game-zone");
  // Determinamos el mensaje en caso de no estar elegido el juego.
  gameZone.innerHTML = "<h1>Elige el juego.</h1>";

  // Realiza una petición GET para obtener los datos del usuario actual.
  fetch(`http://localhost/web/back/public/getworksbysubject?stage=${stage}&subject=${subject}`)
    .then(response => {
      if (!response.ok) {
        // Si la respuesta no es buena, lanzamos un error.
        throw new Error("Error en la respuesta del servidor");
      }
      // Convierte los datos recibidos a un objeto JSON.
      return response.json();
    })
    .then(data => {
      // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente.
      for (const gameName in data) {
        if (data.hasOwnProperty(gameName)) {
          const option = document.createElement("option");
          option.value = gameName;
          option.text = gameName;
          gameSelector.appendChild(option);
          const levels = data[gameName].map(work => work.level);
          gameLevels[gameName] = levels.filter((level, index, arr) => arr.indexOf(level) === index);
        }
      }

      // Agregamos un evento de escucha al selector de los juegos.
      gameSelector?.addEventListener("change", () => {
        // Determinamos el mensaje en caso de estar elegido el juego pero no el nivel.
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
            gameLevel.appendChild(div);
          });
        } else {
          gameLevel.innerHTML = "";
          gameZone.innerHTML = "<h1>Elige el juego.</h1>";
        }
      });

      // Agregamos un evento de escucha al selector de nivel.
      gameLevel.addEventListener("change", () => {
        const selectedGame = gameSelector.value;
        const selectedLevel = document.querySelector("input[name=nivel]:checked")?.value;
        const selectedInput = window.event.target;
        const idEjercicio = selectedInput.getAttribute("id");
        // Cargamos el juego si se ha elegido juego y nivel.
        if (selectedGame && selectedLevel) {
          const script = document.createElement("script");
          script.src = `../Resources/js/games/${idEjercicio}.js?id=${userId}`;
          script.setAttribute("data-level", selectedLevel);
          window.userId = userId;
          // Si el script no está disponible ponemos el mensaje en la zona de juego.
          script.addEventListener("error", () => {
            gameZone.innerHTML = "<h1>El juego no está disponible</h1>";
          });
          gameZone.innerHTML = "";
          gameZone.appendChild(script);
          currentScript = script;
        } else {
          gameZone.innerHTML = "<h1>Elige el juego.</h1>";
        }
      });
    })
});