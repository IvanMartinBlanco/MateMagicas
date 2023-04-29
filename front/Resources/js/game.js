import { getSessionData } from '../js/session.js';

document.addEventListener("DOMContentLoaded", function () {
    if (getSessionData()?.rol !== 'tutor' && getSessionData()?.rol !== 'alumno' && getSessionData()?.rol !== 'administrador') {
        // Redirigir a otra página
        window.location.replace("../../../front/pages/login.html");
      }
      const queryString = window.location.search;

      // Analizar la cadena de consulta para obtener los parámetros
      const params = new URLSearchParams(queryString);
      const stage = params.get('stage');
      const subject = params.get('subject');
    console.log(stage)
    console.log(subject)
  // Llamada al primer fetch
  fetch(`http://localhost/web/back/public/getworksbysubject?stage=${stage}&subject=${subject}`)
    .then(response => {
      if (!response.ok) {
        serverMessage.textContent = "Error en la respuesta del servidor";
      }
      return response.json();
    })
    .then(data => {
      const sortedData = Object.entries(data)
        .sort((a, b) => a[0] - b[0])
        .map(entry => entry[1]);
      variableInputs.forEach((input, index) => {
        const inputValue = sortedData[index] || "";
        input.value = inputValue;

        // Guardar el ID de la variable correspondiente en el array
        variableIds.push(Object.keys(data)[index]);
      });
    })
    .catch(error => {
      console.error(error);
    });

});