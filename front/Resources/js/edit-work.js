import { getSessionData } from '../js/session.js';

// Esperamos a que se cargue completamente el DOM antes de ejecutar la función.
document.addEventListener("DOMContentLoaded", function () {
  // Verificamos si el usuario tiene rol de "administrador" al cargar la página.
  if (getSessionData()?.rol !== 'administrador') {
    // Redirigimos a otra página.
    window.location.replace("http://localhost/web/front/pages/index.html");
  }
  // Obtenemos elementos del formulario y otras secciones.
  const form = document.querySelector('form');
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const variableValue = params.get('variable');
  const workId = params.get('work');
  const serverMessage = document.querySelector('#server-message');
  const closeModal = document.getElementById("cerrarModal");
  let contenedorCampos = document.getElementById('variables-container');
  let variableInputs = [];

  // Creamos los campos de forma dinámica.
  for (let i = 1; i <= variableValue; i++) {
    let variableDiv = document.createElement('div');
    let variableSpan = document.createElement('span');
    variableSpan.setAttribute('class', 'input-container')
    let label = document.createElement('label');
    label.innerHTML = 'Variable ' + i + ':';
    let variableName = 'variable-' + i;
    label.setAttribute('for', variableName);
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('id', variableName);
    input.setAttribute('name', variableName);
    input.setAttribute('required', '');
    input.setAttribute('class', 'little-input');
    let errorDiv = document.createElement('div');
    errorDiv.setAttribute('class', 'error-message');
    variableDiv.appendChild(label);
    variableSpan.appendChild(input);
    variableSpan.appendChild(errorDiv);
    variableDiv.appendChild(variableSpan);
    contenedorCampos.appendChild(variableDiv);
    const variableInput = document.querySelector('#' + variableName);
    variableInputs.push(variableInput);
  }
  let variableIds = [];

  // Realiza una petición GET para obtener los datos del ejercicio actual.
  fetch(`http://localhost/web/back/public/work?id=${workId}`)
    .then(response => {
      if (!response.ok) {
        // Si la respuesta no es buena, lanzamos un error.
        serverMessage.textContent = "Error en la respuesta del servidor";
      }
      // Convierte los datos recibidos a un objeto JSON.
      return response.json();
    })
    .then(data => {
      // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente.
      const sortedData = Object.entries(data)
        .sort((a, b) => a[0] - b[0])
        .map(entry => entry[1]);
      variableInputs.forEach((input, index) => {
        const inputValue = sortedData[index] || "";
        input.value = inputValue;
        variableIds.push(Object.keys(data)[index]);
      });
    })
    // Controlamos si ha habido un error en el servidor.
    .catch(error => {
      console.error(error);
    });

  // Función para mostrar mensaje de error.
  const showError = (input, message) => {
    const errorContainer = input.parentElement;
    const errorMessage = errorContainer.querySelector('.error-message');
    input.classList.add('error');
    errorMessage.textContent = message;
  };
  // Función para ocultar mensaje de error.
  const hideError = (input) => {
    const errorContainer = input.parentElement;
    const errorMessage = errorContainer.querySelector('.error-message');
    input.classList.remove('error');
    errorMessage.textContent = '';
  };

  // Validamos los campos del formulario.
  const checkInputs = () => {
    let isValid = true;
    variableInputs.forEach(input => {
      const value = input.value.trim();
      if (value === '') {
        showError(input, '* Este campo es obligatorio');
        isValid = false;
      } else if (isNaN(value)) {
        showError(input, '* El valor debe ser numérico');
        isValid = false;
      } else {
        hideError(input);
      }
    });
    return isValid;
  };
  // Agregamos un evento de escucha al botón del formulario para enviar una petición PUT a la API.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    serverMessage.textContent = "";
    if (checkInputs()) {
      const data = {};
      variableInputs.forEach((input, index) => {
        const id = variableIds[index];
        data[id] = input.value;
      });
      // Realizamos una petición PUT al servidor, en la URL especificada.
      fetch('http://localhost/web/back/public/editvariable', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          id: workId
        })
      })
        // Si la respuesta es satisfactoria, la convertimos a JSON.
        .then(response => response.json())
        .then(data => {
          // Guardamos los valores obtenidos del servidor en las variables declaradas anteriormente.
          if (data.success) {
            serverMessage.textContent = "";
            const miModal = document.getElementById("modal");
            miModal.style.display = "block";
          } else {
            serverMessage.textContent = data.message;
          }
        })
        // Controlamos si ha habido un error en el servidor.
        .catch(error => console.error(error));
    }
  });
  // Agregamos un evento de escucha al botón de cerrar la modal para ocultarlo cuando se pulse.
  closeModal.addEventListener("click", function () {
    window.location.href = './select-editable-work.html';
  });
});